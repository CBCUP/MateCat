let SSE = {
    init: function () {
        // TODO configure this
        this.baseURL = config.sse_base_url;
        this.initEvents();
    },
    getSource: function ( what ) {
        var source = '';
        switch ( what ) {
            case 'notifications':
                source = '/channel/updates' + '?jid=' + config.id_job + '&pw=' + config.password;
                break;

            default:
                throw new Exception( 'source mapping not found' );
        }

        if ( config.enableMultiDomainApi ) {
            return new EventSource( '//' + Math.floor(Math.random() * config.ajaxDomainsNumber ) + '.ajax.' + SSE.baseURL +  source );
        } else {
            return new EventSource( '//' + SSE.baseURL + source );
        }

    },
    initEvents: function (  ) {
        $( document ).on( 'sse:concordance', function ( ev, message ) {
            SegmentActions.setConcordanceResult(message.data.id_segment, message.data);
        } );

        $( document ).on( 'sse:bulk_segment_status_change', function ( ev, message ) {
            SegmentActions.bulkChangeStatusCallback(message.data.segment_ids, message.data.status);
        } );
        if (config.translation_matches_enabled) {

            $( document ).on( 'sse:contribution', function ( ev, message ) {
                var segment = SegmentStore.getSegmentByIdToJS(message.data.id_segment);
                if ( segment && segment.splitted ) {
                    var segments = SegmentStore.getSegmentsSplitGroup(message.data.id_segment);
                    segments.forEach( function (item) {
                        SegmentActions.getContributionsSuccess( message.data, item.sid );
                    } );
                } else if ( segment ) {
                    SegmentActions.getContributionsSuccess( message.data, message.data.id_segment );
                }
            } );

            $( document ).on( 'sse:cross_language_matches', function ( ev, message ) {
                var segment = SegmentStore.getSegmentByIdToJS(message.data.id_segment);
                if ( segment && segment.splitted ) {
                    var segments = SegmentStore.getSegmentsSplitGroup(message.data.id_segment);
                    segments.forEach( function (item) {
                        SegmentActions.setSegmentCrossLanguageContributions( item.sid, segment.id_file, message.data.matches, [] );
                    } );
                } else if ( segment ) {
                    SegmentActions.setSegmentCrossLanguageContributions( message.data.id_segment, segment.id_file, message.data.matches, [] );
                }
            } );
        }
    },

    Message: function ( data ) {
        this._type = data._type;
        this.data = data;
        this.types = [ 'comment', 'ack', 'contribution', 'concordance', 'bulk_segment_status_change', 'cross_language_matches' ];
        this.eventIdentifier = 'sse:' + this._type;

        this.isValid = function () {

            return (this.types.indexOf( this._type ) !== -1);
        }
    }
};

let NOTIFICATIONS = {
    start: function () {
        var self = this;
        SSE.init();
        this.source = SSE.getSource( 'notifications' );
        this.addEvents();

    },
    restart: function () {
        this.source = SSE.getSource( 'notifications' );
        this.addEvents();
    },
    addEvents: function () {
        var self = this;
        this.source.addEventListener( 'message', function ( e ) {
            var message = new SSE.Message( JSON.parse( e.data ) );
            if ( message.isValid() ) {
                $( document ).trigger( message.eventIdentifier, message );
            }
        }, false );

        this.source.addEventListener( 'error', function ( e ) {
            console.error( "SSE: server disconnect" );
            // console.log( "readyState: " + NOTIFICATIONS.source.readyState );
            if ( NOTIFICATIONS.source.readyState === 2 ) {
                setTimeout( function () {
                    // console.log( "Restart Event Source" );
                    self.source.close();
                    self.restart();
                }, 5000 );
            }

        }, false );

        $( document ).on( 'sse:ack', function ( ev, message ) {
            config.id_client = message.data.clientId;
        } );
    }
};

module.exports = NOTIFICATIONS;