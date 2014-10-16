<?php

/**
 * Created by PhpStorm.
 * User: roberto
 * Date: 02/09/14
 * Time: 13.35
 */
class TmKeyManagement_TmKeyStruct extends stdClass {

    /**
     * @var int This key is for tm. 0 or 1
     */
    public $tm;

    /**
     * @var int This key is for glossary. 0 or 1
     */
    public $glos;

    /**
     * A flag that indicates whether the key has been created by the owner or not
     * @var int 0 or 1
     */
    public $owner;

    /**
     * @var int The uid of the translator that uses that key in the job.
     */
    public $uid_transl;

    /**
     * @var int The uid of the revisor that uses that key in the job.
     */
    public $uid_rev;

    /**
     * @var string The key's name
     */
    public $name;

    /**
     * @var string
     */
    public $key;

    /**
     * @var int Read grant for owner. 0 or 1
     */
    public $r;

    /**
     * @var int Write grant for owner. 0 or 1
     */
    public $w;

    /**
     * @var int Read grant for translator. 0 or 1
     */
    public $r_transl;

    /**
     * @var int Write grant for translator. 0 or 1
     */
    public $w_transl;

    /**
     * @var int Read grant for revisor. 0 or 1
     */
    public $r_rev;

    /**
     * @var int Write grant for revisor. 0 or 1
     */
    public $w_rev;

    /**
     * @var string Source language string. It must be compliant to RFC3066.<br />
     *             <b>Example</b><br />en-US, fr-FR, en-GB
     * @link http://www.i18nguy.com/unicode/language-identifiers.html
     * @link https://tools.ietf.org/html/rfc3066
     *
     */
    public $source;


    /**
     * @var string Target language string. It must be compliant to RFC3066.<br />
     *             <b>Example</b><br />en-US, fr-FR, en-GB
     * @link http://www.i18nguy.com/unicode/language-identifiers.html
     * @link https://tools.ietf.org/html/rfc3066
     *
     */
    public $target;

    /**
     * @param array|TmKeyManagement_TmKeyStruct|null $params An associative array with the following keys:<br/>
     * <pre>
     *    tm         : boolean - Tm key
     *    glos       : boolean - Glossary key
     *    owner      : boolean - The key is set by the Project creator
     *    uid_transl : int     - User ID
     *    uid_rev    : int     - User ID
     *    name       : string
     *    key        : string
     *    r          : boolean - Read privilege
     *    w          : boolean - Write privilege
     *    r_transl   : boolean - Translator Read privilege
     *    w_transl   : boolean - Translator Write privilege
     *    r_rev      : boolean - Revisor Read privilege
     *    w_rev      : boolean - Translator Write privilege
     *    source     : string  - Source languages
     *    target     : string  - Target languages
     * </pre>
     */
    public function __construct( $params = null ) {
        if ( $params != null ) {
            foreach ( $params as $property => $value ) {
                $this->$property = $value;
            }
        }
    }

    public function __set( $name, $value ) {
        if ( !property_exists( $this, $name ) ) {
            throw new DomainException( 'Unknown property ' . $name );
        }
    }

    /**
     * Converts the current object into an associative array
     * @return array
     */
    public function toArray() {
        return (array)$this;
    }

    /**
     * @param TmKeyManagement_TmKeyStruct $obj
     *
     * @return bool
     */
    public function equals( TmKeyManagement_TmKeyStruct $obj ) {
        return $this->key == $obj->key;
    }

    /**
     * @param TmKeyManagement_TmKeyStruct $obj
     *
     * @return TmKeyManagement_TmKeyStruct
     */
    public function mergeWith( TmKeyManagement_TmKeyStruct $obj){
        //pre: $obj->key == $this->key

        //TODO: cancellare sta monnezza
        //Se $obj ha un campo not null allora vince $obj.
        //Se $obj ha un campo null e $this ha lo stesso campo not null, allora vince $this.
        //NOTA: $obj può essere (per esempio) una chiave del client


        //TODO: change this.
        return new TmKeyManagement_TmKeyStruct();
    }

} 