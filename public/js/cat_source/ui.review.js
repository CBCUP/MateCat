/*
 Component: ui.review
 */
Review = {
    enabled : function() {
        return (config.enableReview && !!config.isReview);
    },
    type : config.reviewType
};
$.extend( UI, {

    evalOpenableSegment: function ( segment ) {
        if ( ! (
            segment.status === 'NEW' ||
            segment.status === 'DRAFT'
        ) ) return true;

        if ( UI.projectStats && UI.projectStats.TRANSLATED_PERC === 0 ) {
            alertNoTranslatedSegments()
        } else {
            alertNotTranslatedYet( segment.sid );
        }
        return false;
    }
});

var alertNotTranslatedYet = function( sid ) {
    APP.confirm({
        name: 'confirmNotYetTranslated',
        cancelTxt: 'Close',
        callback: 'openNextTranslated',
        okTxt: 'Open next translated segment',
        context: sid,
        msg: UI.alertNotTranslatedMessage
    });
};

var alertNoTranslatedSegments = function(  ) {
    var props = {
        text: 'There are no translated segments to revise in this job.',
        successText: "Ok",
        successCallback: function() {
            APP.ModalWindow.onCloseModal();
        }
    };
    APP.ModalWindow.showModalComponent(ConfirmMessageModal, props, "Warning");
};


if ( config.enableReview && config.isReview ) {



    (function($, undefined) {

        /**
         * Events
         *
         * Only bind events for specific review type
         */
        $('html').on('afterFormatSelection', '.editor .editarea', function() {
            UI.trackChanges();
        }).on('click', '.editor .outersource .copy', function(e) {
            UI.trackChanges();
        }).on('setCurrentSegment_success', function(e, d, id_segment) {
            UI.addOriginalTranslation(d, id_segment);
        });


        $.extend(UI, {

            alertNotTranslatedMessage : "This segment is not translated yet.<br /> Only translated segments can be revised.",

            trackChanges: function () {
                var currentSegmentId = SegmentStore.getCurrentSegment();
                var $segment = UI.getSegmentById(currentSegmentId).closest('section');
                var source = EditAreaUtils.postProcessEditarea($segment, '.original-translation');
                source = TextUtils.clenaupTextFromPleaceholders( source );
                //Fix for &amp in original-translation
                source = source.replace(/&amp;/g, "&");

                var target = EditAreaUtils.postProcessEditarea($segment, '.targetarea');
                target = TextUtils.clenaupTextFromPleaceholders( target );
                var diffHTML = TextUtils.trackChangesHTML( TextUtils.htmlEncode(source), TextUtils.htmlEncode(target) );
                diffHTML = TagUtils.transformTextForLockTags(diffHTML);
                $('.sub-editor.review .track-changes p', $segment).html( diffHTML );
            },
            setRevision: function( data ){
                APP.doRequest({
                    data: data,
                    error: function() {
                        OfflineUtils.failedConnection( data, 'setRevision' );
                    },
                    success: function(d) {
                        window.quality_report_btn_component.setState({
                            vote: d.data.overall_quality_class
                        });
                    }
                });
            },
            /**
             * Each revision overwrite this function
             * @param e
             * @param button
             */
            clickOnApprovedButton: function (button) {
                return false
            }
        });
    })(jQuery);
}
