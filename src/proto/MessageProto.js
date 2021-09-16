/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd)
        define(["protobufjs/minimal"], factory);

    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require("protobufjs/minimal"));

})(this, function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    // Exported root namespace
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    
    $root.MsgProto = (function() {
    
        /**
         * Properties of a MsgProto.
         * @exports IMsgProto
         * @interface IMsgProto
         */
    
        /**
         * Constructs a new MsgProto.
         * @exports MsgProto
         * @classdesc Represents a MsgProto.
         * @implements IMsgProto
         * @constructor
         * @param {IMsgProto=} [properties] Properties to set
         */
        function MsgProto(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }
    
        /**
         * Creates a new MsgProto instance using the specified properties.
         * @function create
         * @memberof MsgProto
         * @static
         * @param {IMsgProto=} [properties] Properties to set
         * @returns {MsgProto} MsgProto instance
         */
        MsgProto.create = function create(properties) {
            return new MsgProto(properties);
        };
    
        /**
         * Encodes the specified MsgProto message. Does not implicitly {@link MsgProto.verify|verify} messages.
         * @function encode
         * @memberof MsgProto
         * @static
         * @param {IMsgProto} message MsgProto message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MsgProto.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };
    
        /**
         * Encodes the specified MsgProto message, length delimited. Does not implicitly {@link MsgProto.verify|verify} messages.
         * @function encodeDelimited
         * @memberof MsgProto
         * @static
         * @param {IMsgProto} message MsgProto message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MsgProto.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };
    
        /**
         * Decodes a MsgProto message from the specified reader or buffer.
         * @function decode
         * @memberof MsgProto
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {MsgProto} MsgProto
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MsgProto.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MsgProto();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };
    
        /**
         * Decodes a MsgProto message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof MsgProto
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {MsgProto} MsgProto
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MsgProto.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };
    
        /**
         * Verifies a MsgProto message.
         * @function verify
         * @memberof MsgProto
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MsgProto.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };
    
        /**
         * Creates a MsgProto message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof MsgProto
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {MsgProto} MsgProto
         */
        MsgProto.fromObject = function fromObject(object) {
            if (object instanceof $root.MsgProto)
                return object;
            return new $root.MsgProto();
        };
    
        /**
         * Creates a plain object from a MsgProto message. Also converts values to other types if specified.
         * @function toObject
         * @memberof MsgProto
         * @static
         * @param {MsgProto} message MsgProto
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MsgProto.toObject = function toObject() {
            return {};
        };
    
        /**
         * Converts this MsgProto to JSON.
         * @function toJSON
         * @memberof MsgProto
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MsgProto.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        MsgProto.Msg = (function() {
    
            /**
             * Properties of a Msg.
             * @memberof MsgProto
             * @interface IMsg
             * @property {Uint8Array|null} [version] Msg version
             * @property {MsgProto.EnumMsgType|null} [msgType] Msg msgType
             * @property {MsgProto.EnumClassRoomStatus|null} [classRoomStatus] Msg classRoomStatus
             * @property {boolean|null} [chatEnabled] Msg chatEnabled
             * @property {Long|null} [targetRoomId] Msg targetRoomId
             * @property {Array.<Long>|null} [targetGroupRoomIds] Msg targetGroupRoomIds
             * @property {Long|null} [targetUserId] Msg targetUserId
             * @property {Array.<Long>|null} [targetGroupUserIds] Msg targetGroupUserIds
             * @property {boolean|null} [targetBool] Msg targetBool
             * @property {number|null} [targetInt] Msg targetInt
             * @property {Long|null} [targetLong] Msg targetLong
             * @property {Uint8Array|null} [targetBytes] Msg targetBytes
             * @property {string|null} [targetText] Msg targetText
             * @property {Array.<MsgProto.IUserInfo>|null} [userInfoList] Msg userInfoList
             * @property {Array.<MsgProto.IUserStatus>|null} [userStatusList] Msg userStatusList
             * @property {MsgProto.ICombinedInfo|null} [combinedInfo] Msg combinedInfo
             * @property {MsgProto.EnumPushingStatus|null} [pushingStatus] Msg pushingStatus
             * @property {MsgProto.EnumMood|null} [mood] Msg mood
             * @property {MsgProto.IChatInfo|null} [chatInfo] Msg chatInfo
             * @property {Array.<MsgProto.IChatInfo>|null} [chatInfoList] Msg chatInfoList
             * @property {MsgProto.IMediaInfo|null} [mediaInfo] Msg mediaInfo
             * @property {MsgProto.IExerciseInfo|null} [exerciseInfo] Msg exerciseInfo
             * @property {Array.<MsgProto.IExerciseSubmit>|null} [exerciseSubmitList] Msg exerciseSubmitList
             */
    
            /**
             * Constructs a new Msg.
             * @memberof MsgProto
             * @classdesc Represents a Msg.
             * @implements IMsg
             * @constructor
             * @param {MsgProto.IMsg=} [properties] Properties to set
             */
            function Msg(properties) {
                this.targetGroupRoomIds = [];
                this.targetGroupUserIds = [];
                this.userInfoList = [];
                this.userStatusList = [];
                this.chatInfoList = [];
                this.exerciseSubmitList = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Msg version.
             * @member {Uint8Array} version
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.version = $util.newBuffer([]);
    
            /**
             * Msg msgType.
             * @member {MsgProto.EnumMsgType} msgType
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.msgType = 0;
    
            /**
             * Msg classRoomStatus.
             * @member {MsgProto.EnumClassRoomStatus} classRoomStatus
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.classRoomStatus = 0;
    
            /**
             * Msg chatEnabled.
             * @member {boolean} chatEnabled
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.chatEnabled = false;
    
            /**
             * Msg targetRoomId.
             * @member {Long} targetRoomId
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.targetRoomId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
            /**
             * Msg targetGroupRoomIds.
             * @member {Array.<Long>} targetGroupRoomIds
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.targetGroupRoomIds = $util.emptyArray;
    
            /**
             * Msg targetUserId.
             * @member {Long} targetUserId
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.targetUserId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
            /**
             * Msg targetGroupUserIds.
             * @member {Array.<Long>} targetGroupUserIds
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.targetGroupUserIds = $util.emptyArray;
    
            /**
             * Msg targetBool.
             * @member {boolean} targetBool
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.targetBool = false;
    
            /**
             * Msg targetInt.
             * @member {number} targetInt
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.targetInt = 0;
    
            /**
             * Msg targetLong.
             * @member {Long} targetLong
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.targetLong = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
            /**
             * Msg targetBytes.
             * @member {Uint8Array} targetBytes
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.targetBytes = $util.newBuffer([]);
    
            /**
             * Msg targetText.
             * @member {string} targetText
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.targetText = "";
    
            /**
             * Msg userInfoList.
             * @member {Array.<MsgProto.IUserInfo>} userInfoList
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.userInfoList = $util.emptyArray;
    
            /**
             * Msg userStatusList.
             * @member {Array.<MsgProto.IUserStatus>} userStatusList
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.userStatusList = $util.emptyArray;
    
            /**
             * Msg combinedInfo.
             * @member {MsgProto.ICombinedInfo|null|undefined} combinedInfo
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.combinedInfo = null;
    
            /**
             * Msg pushingStatus.
             * @member {MsgProto.EnumPushingStatus} pushingStatus
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.pushingStatus = 0;
    
            /**
             * Msg mood.
             * @member {MsgProto.EnumMood} mood
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.mood = 0;
    
            /**
             * Msg chatInfo.
             * @member {MsgProto.IChatInfo|null|undefined} chatInfo
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.chatInfo = null;
    
            /**
             * Msg chatInfoList.
             * @member {Array.<MsgProto.IChatInfo>} chatInfoList
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.chatInfoList = $util.emptyArray;
    
            /**
             * Msg mediaInfo.
             * @member {MsgProto.IMediaInfo|null|undefined} mediaInfo
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.mediaInfo = null;
    
            /**
             * Msg exerciseInfo.
             * @member {MsgProto.IExerciseInfo|null|undefined} exerciseInfo
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.exerciseInfo = null;
    
            /**
             * Msg exerciseSubmitList.
             * @member {Array.<MsgProto.IExerciseSubmit>} exerciseSubmitList
             * @memberof MsgProto.Msg
             * @instance
             */
            Msg.prototype.exerciseSubmitList = $util.emptyArray;
    
            /**
             * Creates a new Msg instance using the specified properties.
             * @function create
             * @memberof MsgProto.Msg
             * @static
             * @param {MsgProto.IMsg=} [properties] Properties to set
             * @returns {MsgProto.Msg} Msg instance
             */
            Msg.create = function create(properties) {
                return new Msg(properties);
            };
    
            /**
             * Encodes the specified Msg message. Does not implicitly {@link MsgProto.Msg.verify|verify} messages.
             * @function encode
             * @memberof MsgProto.Msg
             * @static
             * @param {MsgProto.IMsg} message Msg message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Msg.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.version);
                if (message.msgType != null && Object.hasOwnProperty.call(message, "msgType"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.msgType);
                if (message.classRoomStatus != null && Object.hasOwnProperty.call(message, "classRoomStatus"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.classRoomStatus);
                if (message.chatEnabled != null && Object.hasOwnProperty.call(message, "chatEnabled"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.chatEnabled);
                if (message.targetRoomId != null && Object.hasOwnProperty.call(message, "targetRoomId"))
                    writer.uint32(/* id 11, wireType 1 =*/89).fixed64(message.targetRoomId);
                if (message.targetGroupRoomIds != null && message.targetGroupRoomIds.length) {
                    writer.uint32(/* id 12, wireType 2 =*/98).fork();
                    for (var i = 0; i < message.targetGroupRoomIds.length; ++i)
                        writer.fixed64(message.targetGroupRoomIds[i]);
                    writer.ldelim();
                }
                if (message.targetUserId != null && Object.hasOwnProperty.call(message, "targetUserId"))
                    writer.uint32(/* id 13, wireType 1 =*/105).fixed64(message.targetUserId);
                if (message.targetGroupUserIds != null && message.targetGroupUserIds.length) {
                    writer.uint32(/* id 14, wireType 2 =*/114).fork();
                    for (var i = 0; i < message.targetGroupUserIds.length; ++i)
                        writer.fixed64(message.targetGroupUserIds[i]);
                    writer.ldelim();
                }
                if (message.targetBool != null && Object.hasOwnProperty.call(message, "targetBool"))
                    writer.uint32(/* id 15, wireType 0 =*/120).bool(message.targetBool);
                if (message.targetInt != null && Object.hasOwnProperty.call(message, "targetInt"))
                    writer.uint32(/* id 16, wireType 0 =*/128).int32(message.targetInt);
                if (message.targetLong != null && Object.hasOwnProperty.call(message, "targetLong"))
                    writer.uint32(/* id 17, wireType 1 =*/137).fixed64(message.targetLong);
                if (message.targetBytes != null && Object.hasOwnProperty.call(message, "targetBytes"))
                    writer.uint32(/* id 18, wireType 2 =*/146).bytes(message.targetBytes);
                if (message.targetText != null && Object.hasOwnProperty.call(message, "targetText"))
                    writer.uint32(/* id 19, wireType 2 =*/154).string(message.targetText);
                if (message.userInfoList != null && message.userInfoList.length)
                    for (var i = 0; i < message.userInfoList.length; ++i)
                        $root.MsgProto.UserInfo.encode(message.userInfoList[i], writer.uint32(/* id 31, wireType 2 =*/250).fork()).ldelim();
                if (message.userStatusList != null && message.userStatusList.length)
                    for (var i = 0; i < message.userStatusList.length; ++i)
                        $root.MsgProto.UserStatus.encode(message.userStatusList[i], writer.uint32(/* id 32, wireType 2 =*/258).fork()).ldelim();
                if (message.combinedInfo != null && Object.hasOwnProperty.call(message, "combinedInfo"))
                    $root.MsgProto.CombinedInfo.encode(message.combinedInfo, writer.uint32(/* id 51, wireType 2 =*/410).fork()).ldelim();
                if (message.pushingStatus != null && Object.hasOwnProperty.call(message, "pushingStatus"))
                    writer.uint32(/* id 52, wireType 0 =*/416).int32(message.pushingStatus);
                if (message.mood != null && Object.hasOwnProperty.call(message, "mood"))
                    writer.uint32(/* id 53, wireType 0 =*/424).int32(message.mood);
                if (message.chatInfo != null && Object.hasOwnProperty.call(message, "chatInfo"))
                    $root.MsgProto.ChatInfo.encode(message.chatInfo, writer.uint32(/* id 54, wireType 2 =*/434).fork()).ldelim();
                if (message.chatInfoList != null && message.chatInfoList.length)
                    for (var i = 0; i < message.chatInfoList.length; ++i)
                        $root.MsgProto.ChatInfo.encode(message.chatInfoList[i], writer.uint32(/* id 55, wireType 2 =*/442).fork()).ldelim();
                if (message.mediaInfo != null && Object.hasOwnProperty.call(message, "mediaInfo"))
                    $root.MsgProto.MediaInfo.encode(message.mediaInfo, writer.uint32(/* id 56, wireType 2 =*/450).fork()).ldelim();
                if (message.exerciseInfo != null && Object.hasOwnProperty.call(message, "exerciseInfo"))
                    $root.MsgProto.ExerciseInfo.encode(message.exerciseInfo, writer.uint32(/* id 57, wireType 2 =*/458).fork()).ldelim();
                if (message.exerciseSubmitList != null && message.exerciseSubmitList.length)
                    for (var i = 0; i < message.exerciseSubmitList.length; ++i)
                        $root.MsgProto.ExerciseSubmit.encode(message.exerciseSubmitList[i], writer.uint32(/* id 58, wireType 2 =*/466).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified Msg message, length delimited. Does not implicitly {@link MsgProto.Msg.verify|verify} messages.
             * @function encodeDelimited
             * @memberof MsgProto.Msg
             * @static
             * @param {MsgProto.IMsg} message Msg message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Msg.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a Msg message from the specified reader or buffer.
             * @function decode
             * @memberof MsgProto.Msg
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {MsgProto.Msg} Msg
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Msg.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MsgProto.Msg();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.version = reader.bytes();
                        break;
                    case 2:
                        message.msgType = reader.int32();
                        break;
                    case 3:
                        message.classRoomStatus = reader.int32();
                        break;
                    case 4:
                        message.chatEnabled = reader.bool();
                        break;
                    case 11:
                        message.targetRoomId = reader.fixed64();
                        break;
                    case 12:
                        if (!(message.targetGroupRoomIds && message.targetGroupRoomIds.length))
                            message.targetGroupRoomIds = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.targetGroupRoomIds.push(reader.fixed64());
                        } else
                            message.targetGroupRoomIds.push(reader.fixed64());
                        break;
                    case 13:
                        message.targetUserId = reader.fixed64();
                        break;
                    case 14:
                        if (!(message.targetGroupUserIds && message.targetGroupUserIds.length))
                            message.targetGroupUserIds = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.targetGroupUserIds.push(reader.fixed64());
                        } else
                            message.targetGroupUserIds.push(reader.fixed64());
                        break;
                    case 15:
                        message.targetBool = reader.bool();
                        break;
                    case 16:
                        message.targetInt = reader.int32();
                        break;
                    case 17:
                        message.targetLong = reader.fixed64();
                        break;
                    case 18:
                        message.targetBytes = reader.bytes();
                        break;
                    case 19:
                        message.targetText = reader.string();
                        break;
                    case 31:
                        if (!(message.userInfoList && message.userInfoList.length))
                            message.userInfoList = [];
                        message.userInfoList.push($root.MsgProto.UserInfo.decode(reader, reader.uint32()));
                        break;
                    case 32:
                        if (!(message.userStatusList && message.userStatusList.length))
                            message.userStatusList = [];
                        message.userStatusList.push($root.MsgProto.UserStatus.decode(reader, reader.uint32()));
                        break;
                    case 51:
                        message.combinedInfo = $root.MsgProto.CombinedInfo.decode(reader, reader.uint32());
                        break;
                    case 52:
                        message.pushingStatus = reader.int32();
                        break;
                    case 53:
                        message.mood = reader.int32();
                        break;
                    case 54:
                        message.chatInfo = $root.MsgProto.ChatInfo.decode(reader, reader.uint32());
                        break;
                    case 55:
                        if (!(message.chatInfoList && message.chatInfoList.length))
                            message.chatInfoList = [];
                        message.chatInfoList.push($root.MsgProto.ChatInfo.decode(reader, reader.uint32()));
                        break;
                    case 56:
                        message.mediaInfo = $root.MsgProto.MediaInfo.decode(reader, reader.uint32());
                        break;
                    case 57:
                        message.exerciseInfo = $root.MsgProto.ExerciseInfo.decode(reader, reader.uint32());
                        break;
                    case 58:
                        if (!(message.exerciseSubmitList && message.exerciseSubmitList.length))
                            message.exerciseSubmitList = [];
                        message.exerciseSubmitList.push($root.MsgProto.ExerciseSubmit.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a Msg message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof MsgProto.Msg
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {MsgProto.Msg} Msg
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Msg.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a Msg message.
             * @function verify
             * @memberof MsgProto.Msg
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Msg.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.version != null && message.hasOwnProperty("version"))
                    if (!(message.version && typeof message.version.length === "number" || $util.isString(message.version)))
                        return "version: buffer expected";
                if (message.msgType != null && message.hasOwnProperty("msgType"))
                    switch (message.msgType) {
                    default:
                        return "msgType: enum value expected";
                    case 0:
                    case 1:
                    case 11:
                    case 12:
                    case 13:
                    case 14:
                    case 15:
                    case 16:
                    case 17:
                    case 31:
                    case 32:
                    case 33:
                    case 34:
                    case 35:
                    case 36:
                    case 37:
                    case 38:
                    case 39:
                    case 51:
                    case 52:
                    case 53:
                    case 71:
                    case 72:
                    case 73:
                    case 74:
                    case 101:
                    case 102:
                    case 103:
                    case 131:
                    case 132:
                    case 161:
                    case 162:
                    case 201:
                    case 202:
                    case 203:
                    case 204:
                    case 205:
                    case 251:
                    case 252:
                    case 253:
                    case 254:
                    case 255:
                    case 256:
                    case 257:
                    case 258:
                    case 301:
                    case 302:
                    case 303:
                    case 304:
                    case 351:
                    case 401:
                    case 402:
                    case 403:
                        break;
                    }
                if (message.classRoomStatus != null && message.hasOwnProperty("classRoomStatus"))
                    switch (message.classRoomStatus) {
                    default:
                        return "classRoomStatus: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 98:
                    case 99:
                        break;
                    }
                if (message.chatEnabled != null && message.hasOwnProperty("chatEnabled"))
                    if (typeof message.chatEnabled !== "boolean")
                        return "chatEnabled: boolean expected";
                if (message.targetRoomId != null && message.hasOwnProperty("targetRoomId"))
                    if (!$util.isInteger(message.targetRoomId) && !(message.targetRoomId && $util.isInteger(message.targetRoomId.low) && $util.isInteger(message.targetRoomId.high)))
                        return "targetRoomId: integer|Long expected";
                if (message.targetGroupRoomIds != null && message.hasOwnProperty("targetGroupRoomIds")) {
                    if (!Array.isArray(message.targetGroupRoomIds))
                        return "targetGroupRoomIds: array expected";
                    for (var i = 0; i < message.targetGroupRoomIds.length; ++i)
                        if (!$util.isInteger(message.targetGroupRoomIds[i]) && !(message.targetGroupRoomIds[i] && $util.isInteger(message.targetGroupRoomIds[i].low) && $util.isInteger(message.targetGroupRoomIds[i].high)))
                            return "targetGroupRoomIds: integer|Long[] expected";
                }
                if (message.targetUserId != null && message.hasOwnProperty("targetUserId"))
                    if (!$util.isInteger(message.targetUserId) && !(message.targetUserId && $util.isInteger(message.targetUserId.low) && $util.isInteger(message.targetUserId.high)))
                        return "targetUserId: integer|Long expected";
                if (message.targetGroupUserIds != null && message.hasOwnProperty("targetGroupUserIds")) {
                    if (!Array.isArray(message.targetGroupUserIds))
                        return "targetGroupUserIds: array expected";
                    for (var i = 0; i < message.targetGroupUserIds.length; ++i)
                        if (!$util.isInteger(message.targetGroupUserIds[i]) && !(message.targetGroupUserIds[i] && $util.isInteger(message.targetGroupUserIds[i].low) && $util.isInteger(message.targetGroupUserIds[i].high)))
                            return "targetGroupUserIds: integer|Long[] expected";
                }
                if (message.targetBool != null && message.hasOwnProperty("targetBool"))
                    if (typeof message.targetBool !== "boolean")
                        return "targetBool: boolean expected";
                if (message.targetInt != null && message.hasOwnProperty("targetInt"))
                    if (!$util.isInteger(message.targetInt))
                        return "targetInt: integer expected";
                if (message.targetLong != null && message.hasOwnProperty("targetLong"))
                    if (!$util.isInteger(message.targetLong) && !(message.targetLong && $util.isInteger(message.targetLong.low) && $util.isInteger(message.targetLong.high)))
                        return "targetLong: integer|Long expected";
                if (message.targetBytes != null && message.hasOwnProperty("targetBytes"))
                    if (!(message.targetBytes && typeof message.targetBytes.length === "number" || $util.isString(message.targetBytes)))
                        return "targetBytes: buffer expected";
                if (message.targetText != null && message.hasOwnProperty("targetText"))
                    if (!$util.isString(message.targetText))
                        return "targetText: string expected";
                if (message.userInfoList != null && message.hasOwnProperty("userInfoList")) {
                    if (!Array.isArray(message.userInfoList))
                        return "userInfoList: array expected";
                    for (var i = 0; i < message.userInfoList.length; ++i) {
                        var error = $root.MsgProto.UserInfo.verify(message.userInfoList[i]);
                        if (error)
                            return "userInfoList." + error;
                    }
                }
                if (message.userStatusList != null && message.hasOwnProperty("userStatusList")) {
                    if (!Array.isArray(message.userStatusList))
                        return "userStatusList: array expected";
                    for (var i = 0; i < message.userStatusList.length; ++i) {
                        var error = $root.MsgProto.UserStatus.verify(message.userStatusList[i]);
                        if (error)
                            return "userStatusList." + error;
                    }
                }
                if (message.combinedInfo != null && message.hasOwnProperty("combinedInfo")) {
                    var error = $root.MsgProto.CombinedInfo.verify(message.combinedInfo);
                    if (error)
                        return "combinedInfo." + error;
                }
                if (message.pushingStatus != null && message.hasOwnProperty("pushingStatus"))
                    switch (message.pushingStatus) {
                    default:
                        return "pushingStatus: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        break;
                    }
                if (message.mood != null && message.hasOwnProperty("mood"))
                    switch (message.mood) {
                    default:
                        return "mood: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        break;
                    }
                if (message.chatInfo != null && message.hasOwnProperty("chatInfo")) {
                    var error = $root.MsgProto.ChatInfo.verify(message.chatInfo);
                    if (error)
                        return "chatInfo." + error;
                }
                if (message.chatInfoList != null && message.hasOwnProperty("chatInfoList")) {
                    if (!Array.isArray(message.chatInfoList))
                        return "chatInfoList: array expected";
                    for (var i = 0; i < message.chatInfoList.length; ++i) {
                        var error = $root.MsgProto.ChatInfo.verify(message.chatInfoList[i]);
                        if (error)
                            return "chatInfoList." + error;
                    }
                }
                if (message.mediaInfo != null && message.hasOwnProperty("mediaInfo")) {
                    var error = $root.MsgProto.MediaInfo.verify(message.mediaInfo);
                    if (error)
                        return "mediaInfo." + error;
                }
                if (message.exerciseInfo != null && message.hasOwnProperty("exerciseInfo")) {
                    var error = $root.MsgProto.ExerciseInfo.verify(message.exerciseInfo);
                    if (error)
                        return "exerciseInfo." + error;
                }
                if (message.exerciseSubmitList != null && message.hasOwnProperty("exerciseSubmitList")) {
                    if (!Array.isArray(message.exerciseSubmitList))
                        return "exerciseSubmitList: array expected";
                    for (var i = 0; i < message.exerciseSubmitList.length; ++i) {
                        var error = $root.MsgProto.ExerciseSubmit.verify(message.exerciseSubmitList[i]);
                        if (error)
                            return "exerciseSubmitList." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a Msg message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof MsgProto.Msg
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {MsgProto.Msg} Msg
             */
            Msg.fromObject = function fromObject(object) {
                if (object instanceof $root.MsgProto.Msg)
                    return object;
                var message = new $root.MsgProto.Msg();
                if (object.version != null)
                    if (typeof object.version === "string")
                        $util.base64.decode(object.version, message.version = $util.newBuffer($util.base64.length(object.version)), 0);
                    else if (object.version.length)
                        message.version = object.version;
                switch (object.msgType) {
                case "MSG_UNKNOWN":
                case 0:
                    message.msgType = 0;
                    break;
                case "MSG_PONG":
                case 1:
                    message.msgType = 1;
                    break;
                case "MSG_TO_ALL__USER_STATUS_PARTIAL":
                case 11:
                    message.msgType = 11;
                    break;
                case "MSG_TO_ALL__USER_STATUS":
                case 12:
                    message.msgType = 12;
                    break;
                case "MSG_TO_ALL__ONLINE__USER_STATUS_PARTIAL":
                case 13:
                    message.msgType = 13;
                    break;
                case "MSG_TO_ALL__START_CLASS":
                case 14:
                    message.msgType = 14;
                    break;
                case "MSG_TO_ALL__END_CLASS":
                case 15:
                    message.msgType = 15;
                    break;
                case "MSG_TO_ALL__REST":
                case 16:
                    message.msgType = 16;
                    break;
                case "MSG_TO_ALL__REST_CANCEL":
                case 17:
                    message.msgType = 17;
                    break;
                case "MSG_TO_ALL__TEACHER_SWITCH__USER_STATUS_PARTIAL":
                case 31:
                    message.msgType = 31;
                    break;
                case "MSG_TO_ALL__HANDS_UP__USER_STATUS_PARTIAL":
                case 32:
                    message.msgType = 32;
                    break;
                case "MSG_TO_ALL__LEARN_STATUS__USER_STATUS_PARTIAL":
                case 33:
                    message.msgType = 33;
                    break;
                case "MSG_TO_ALL__PUSHING_STATUS__USER_STATUS_PARTIAL":
                case 34:
                    message.msgType = 34;
                    break;
                case "MSG_TO_ALL__SHARING_STATUS__USER_STATUS_PARTIAL":
                case 35:
                    message.msgType = 35;
                    break;
                case "MSG_TO_ALL__MUTE_AUDIO__USER_STATUS_PARTIAL":
                case 36:
                    message.msgType = 36;
                    break;
                case "MSG_TO_ALL__FULLSCREEN__USER_STATUS_PARTIAL":
                case 37:
                    message.msgType = 37;
                    break;
                case "MSG_TO_ALL__WHITEBOARD__USER_STATUS_PARTIAL":
                case 38:
                    message.msgType = 38;
                    break;
                case "MSG_TO_ALL__COMBINED__USER_STATUS_PARTIAL":
                case 39:
                    message.msgType = 39;
                    break;
                case "MSG_TO_ALL__ALL_HANDS_DOWN__USER_STATUS_PARTIAL":
                case 51:
                    message.msgType = 51;
                    break;
                case "MSG_TO_ALL__ALL_MUTE__USER_STATUS_PARTIAL":
                case 52:
                    message.msgType = 52;
                    break;
                case "MSG_TO_ALL__KICK_ALL_EXIT_ROOM":
                case 53:
                    message.msgType = 53;
                    break;
                case "MSG_TO_ALL__AWARD_SINGLE__USER_STATUS_PARTIAL":
                case 71:
                    message.msgType = 71;
                    break;
                case "MSG_TO_ALL__AWARD_GROUP__USER_STATUS_PARTIAL":
                case 72:
                    message.msgType = 72;
                    break;
                case "MSG_TO_ALL__AWARD_ONLINE__USER_STATUS_PARTIAL":
                case 73:
                    message.msgType = 73;
                    break;
                case "MSG_TO_ALL__AWARD_ALL__USER_STATUS_PARTIAL":
                case 74:
                    message.msgType = 74;
                    break;
                case "MSG_TO_ALL__EXERCISE_OPEN":
                case 101:
                    message.msgType = 101;
                    break;
                case "MSG_TO_ALL__EXERCISE_CLOSE":
                case 102:
                    message.msgType = 102;
                    break;
                case "MSG_TO_ALL__EXERCISE_SUBMIT":
                case 103:
                    message.msgType = 103;
                    break;
                case "MSG_TO_ALL__IM_TEXT":
                case 131:
                    message.msgType = 131;
                    break;
                case "MSG_TO_ALL__IM_STATUS":
                case 132:
                    message.msgType = 132;
                    break;
                case "MSG_TO_ALL__MEDIA_OPEN":
                case 161:
                    message.msgType = 161;
                    break;
                case "MSG_TO_ALL__MEDIA_CLOSE":
                case 162:
                    message.msgType = 162;
                    break;
                case "MSG_TO_NONE__DUMMY":
                case 201:
                    message.msgType = 201;
                    break;
                case "MSG_TO_NONE__MEDIA_UPDATE_POSITION":
                case 202:
                    message.msgType = 202;
                    break;
                case "MSG_TO_NONE__KICK_PUSHING":
                case 203:
                    message.msgType = 203;
                    break;
                case "MSG_TO_NONE__UPDATE_USER_INFO":
                case 204:
                    message.msgType = 204;
                    break;
                case "MSG_TO_NONE__UPDATE_ALL_STATUS":
                case 205:
                    message.msgType = 205;
                    break;
                case "MSG_TO_SENDER__USER_STATUS_PARTIAL":
                case 251:
                    message.msgType = 251;
                    break;
                case "MSG_TO_SENDER__HANDSHAKE_SUCCESS":
                case 252:
                    message.msgType = 252;
                    break;
                case "MSG_TO_SENDER__ROOM_INFO":
                case 253:
                    message.msgType = 253;
                    break;
                case "MSG_TO_SENDER__USER_INFO":
                case 254:
                    message.msgType = 254;
                    break;
                case "MSG_TO_SENDER__USER_STATUS":
                case 255:
                    message.msgType = 255;
                    break;
                case "MSG_TO_SENDER__VERSION_CHECK":
                case 256:
                    message.msgType = 256;
                    break;
                case "MSG_TO_SENDER__KICK_BY_NOT_RIGHT_TIME":
                case 257:
                    message.msgType = 257;
                    break;
                case "MSG_TO_SENDER__KICK_BY_ROOM_FULL":
                case 258:
                    message.msgType = 258;
                    break;
                case "MSG_TO_TARGET__USER_STATUS_PARTIAL":
                case 301:
                    message.msgType = 301;
                    break;
                case "MSG_TO_TARGET__ZOOM_CAMERA":
                case 302:
                    message.msgType = 302;
                    break;
                case "MSG_TO_TARGET__KICK_EXIT_ROOM":
                case 303:
                    message.msgType = 303;
                    break;
                case "MSG_TO_TARGET__KICK_BY_LOGIN_EXPIRE":
                case 304:
                    message.msgType = 304;
                    break;
                case "MSG_TO_GROUP_KICK_ALL_STUDENT_EXIT_ROOM":
                case 351:
                    message.msgType = 351;
                    break;
                case "MSG_TO_ALL_EXCEPT_SENDER__MEDIA_CHANGE_POSITION":
                case 401:
                    message.msgType = 401;
                    break;
                case "MSG_TO_ALL_EXCEPT_SENDER__MEDIA_PAUSE":
                case 402:
                    message.msgType = 402;
                    break;
                case "MSG_TO_ALL_EXCEPT_SENDER__UPDATE_SINGLE_USER_INFO":
                case 403:
                    message.msgType = 403;
                    break;
                }
                switch (object.classRoomStatus) {
                case "NOT_STARTED":
                case 0:
                    message.classRoomStatus = 0;
                    break;
                case "STARTING":
                case 1:
                    message.classRoomStatus = 1;
                    break;
                case "STARTED":
                case 2:
                    message.classRoomStatus = 2;
                    break;
                case "STARTED_REST":
                case 3:
                    message.classRoomStatus = 3;
                    break;
                case "ENDING":
                case 98:
                    message.classRoomStatus = 98;
                    break;
                case "END":
                case 99:
                    message.classRoomStatus = 99;
                    break;
                }
                if (object.chatEnabled != null)
                    message.chatEnabled = Boolean(object.chatEnabled);
                if (object.targetRoomId != null)
                    if ($util.Long)
                        (message.targetRoomId = $util.Long.fromValue(object.targetRoomId)).unsigned = false;
                    else if (typeof object.targetRoomId === "string")
                        message.targetRoomId = parseInt(object.targetRoomId, 10);
                    else if (typeof object.targetRoomId === "number")
                        message.targetRoomId = object.targetRoomId;
                    else if (typeof object.targetRoomId === "object")
                        message.targetRoomId = new $util.LongBits(object.targetRoomId.low >>> 0, object.targetRoomId.high >>> 0).toNumber();
                if (object.targetGroupRoomIds) {
                    if (!Array.isArray(object.targetGroupRoomIds))
                        throw TypeError(".MsgProto.Msg.targetGroupRoomIds: array expected");
                    message.targetGroupRoomIds = [];
                    for (var i = 0; i < object.targetGroupRoomIds.length; ++i)
                        if ($util.Long)
                            (message.targetGroupRoomIds[i] = $util.Long.fromValue(object.targetGroupRoomIds[i])).unsigned = false;
                        else if (typeof object.targetGroupRoomIds[i] === "string")
                            message.targetGroupRoomIds[i] = parseInt(object.targetGroupRoomIds[i], 10);
                        else if (typeof object.targetGroupRoomIds[i] === "number")
                            message.targetGroupRoomIds[i] = object.targetGroupRoomIds[i];
                        else if (typeof object.targetGroupRoomIds[i] === "object")
                            message.targetGroupRoomIds[i] = new $util.LongBits(object.targetGroupRoomIds[i].low >>> 0, object.targetGroupRoomIds[i].high >>> 0).toNumber();
                }
                if (object.targetUserId != null)
                    if ($util.Long)
                        (message.targetUserId = $util.Long.fromValue(object.targetUserId)).unsigned = false;
                    else if (typeof object.targetUserId === "string")
                        message.targetUserId = parseInt(object.targetUserId, 10);
                    else if (typeof object.targetUserId === "number")
                        message.targetUserId = object.targetUserId;
                    else if (typeof object.targetUserId === "object")
                        message.targetUserId = new $util.LongBits(object.targetUserId.low >>> 0, object.targetUserId.high >>> 0).toNumber();
                if (object.targetGroupUserIds) {
                    if (!Array.isArray(object.targetGroupUserIds))
                        throw TypeError(".MsgProto.Msg.targetGroupUserIds: array expected");
                    message.targetGroupUserIds = [];
                    for (var i = 0; i < object.targetGroupUserIds.length; ++i)
                        if ($util.Long)
                            (message.targetGroupUserIds[i] = $util.Long.fromValue(object.targetGroupUserIds[i])).unsigned = false;
                        else if (typeof object.targetGroupUserIds[i] === "string")
                            message.targetGroupUserIds[i] = parseInt(object.targetGroupUserIds[i], 10);
                        else if (typeof object.targetGroupUserIds[i] === "number")
                            message.targetGroupUserIds[i] = object.targetGroupUserIds[i];
                        else if (typeof object.targetGroupUserIds[i] === "object")
                            message.targetGroupUserIds[i] = new $util.LongBits(object.targetGroupUserIds[i].low >>> 0, object.targetGroupUserIds[i].high >>> 0).toNumber();
                }
                if (object.targetBool != null)
                    message.targetBool = Boolean(object.targetBool);
                if (object.targetInt != null)
                    message.targetInt = object.targetInt | 0;
                if (object.targetLong != null)
                    if ($util.Long)
                        (message.targetLong = $util.Long.fromValue(object.targetLong)).unsigned = false;
                    else if (typeof object.targetLong === "string")
                        message.targetLong = parseInt(object.targetLong, 10);
                    else if (typeof object.targetLong === "number")
                        message.targetLong = object.targetLong;
                    else if (typeof object.targetLong === "object")
                        message.targetLong = new $util.LongBits(object.targetLong.low >>> 0, object.targetLong.high >>> 0).toNumber();
                if (object.targetBytes != null)
                    if (typeof object.targetBytes === "string")
                        $util.base64.decode(object.targetBytes, message.targetBytes = $util.newBuffer($util.base64.length(object.targetBytes)), 0);
                    else if (object.targetBytes.length)
                        message.targetBytes = object.targetBytes;
                if (object.targetText != null)
                    message.targetText = String(object.targetText);
                if (object.userInfoList) {
                    if (!Array.isArray(object.userInfoList))
                        throw TypeError(".MsgProto.Msg.userInfoList: array expected");
                    message.userInfoList = [];
                    for (var i = 0; i < object.userInfoList.length; ++i) {
                        if (typeof object.userInfoList[i] !== "object")
                            throw TypeError(".MsgProto.Msg.userInfoList: object expected");
                        message.userInfoList[i] = $root.MsgProto.UserInfo.fromObject(object.userInfoList[i]);
                    }
                }
                if (object.userStatusList) {
                    if (!Array.isArray(object.userStatusList))
                        throw TypeError(".MsgProto.Msg.userStatusList: array expected");
                    message.userStatusList = [];
                    for (var i = 0; i < object.userStatusList.length; ++i) {
                        if (typeof object.userStatusList[i] !== "object")
                            throw TypeError(".MsgProto.Msg.userStatusList: object expected");
                        message.userStatusList[i] = $root.MsgProto.UserStatus.fromObject(object.userStatusList[i]);
                    }
                }
                if (object.combinedInfo != null) {
                    if (typeof object.combinedInfo !== "object")
                        throw TypeError(".MsgProto.Msg.combinedInfo: object expected");
                    message.combinedInfo = $root.MsgProto.CombinedInfo.fromObject(object.combinedInfo);
                }
                switch (object.pushingStatus) {
                case "PUSHING_NONE":
                case 0:
                    message.pushingStatus = 0;
                    break;
                case "PUSHING_AUDIO":
                case 1:
                    message.pushingStatus = 1;
                    break;
                case "PUSHING_FRONT":
                case 2:
                    message.pushingStatus = 2;
                    break;
                case "PUSHING_BACK":
                case 3:
                    message.pushingStatus = 3;
                    break;
                }
                switch (object.mood) {
                case "ACTIVE":
                case 0:
                    message.mood = 0;
                    break;
                case "HARDWORKING":
                case 1:
                    message.mood = 1;
                    break;
                case "NORMAL":
                case 2:
                    message.mood = 2;
                    break;
                case "WONDERING":
                case 3:
                    message.mood = 3;
                    break;
                }
                if (object.chatInfo != null) {
                    if (typeof object.chatInfo !== "object")
                        throw TypeError(".MsgProto.Msg.chatInfo: object expected");
                    message.chatInfo = $root.MsgProto.ChatInfo.fromObject(object.chatInfo);
                }
                if (object.chatInfoList) {
                    if (!Array.isArray(object.chatInfoList))
                        throw TypeError(".MsgProto.Msg.chatInfoList: array expected");
                    message.chatInfoList = [];
                    for (var i = 0; i < object.chatInfoList.length; ++i) {
                        if (typeof object.chatInfoList[i] !== "object")
                            throw TypeError(".MsgProto.Msg.chatInfoList: object expected");
                        message.chatInfoList[i] = $root.MsgProto.ChatInfo.fromObject(object.chatInfoList[i]);
                    }
                }
                if (object.mediaInfo != null) {
                    if (typeof object.mediaInfo !== "object")
                        throw TypeError(".MsgProto.Msg.mediaInfo: object expected");
                    message.mediaInfo = $root.MsgProto.MediaInfo.fromObject(object.mediaInfo);
                }
                if (object.exerciseInfo != null) {
                    if (typeof object.exerciseInfo !== "object")
                        throw TypeError(".MsgProto.Msg.exerciseInfo: object expected");
                    message.exerciseInfo = $root.MsgProto.ExerciseInfo.fromObject(object.exerciseInfo);
                }
                if (object.exerciseSubmitList) {
                    if (!Array.isArray(object.exerciseSubmitList))
                        throw TypeError(".MsgProto.Msg.exerciseSubmitList: array expected");
                    message.exerciseSubmitList = [];
                    for (var i = 0; i < object.exerciseSubmitList.length; ++i) {
                        if (typeof object.exerciseSubmitList[i] !== "object")
                            throw TypeError(".MsgProto.Msg.exerciseSubmitList: object expected");
                        message.exerciseSubmitList[i] = $root.MsgProto.ExerciseSubmit.fromObject(object.exerciseSubmitList[i]);
                    }
                }
                return message;
            };
    
            /**
             * Creates a plain object from a Msg message. Also converts values to other types if specified.
             * @function toObject
             * @memberof MsgProto.Msg
             * @static
             * @param {MsgProto.Msg} message Msg
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Msg.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.targetGroupRoomIds = [];
                    object.targetGroupUserIds = [];
                    object.userInfoList = [];
                    object.userStatusList = [];
                    object.chatInfoList = [];
                    object.exerciseSubmitList = [];
                }
                if (options.defaults) {
                    if (options.bytes === String)
                        object.version = "";
                    else {
                        object.version = [];
                        if (options.bytes !== Array)
                            object.version = $util.newBuffer(object.version);
                    }
                    object.msgType = options.enums === String ? "MSG_UNKNOWN" : 0;
                    object.classRoomStatus = options.enums === String ? "NOT_STARTED" : 0;
                    object.chatEnabled = false;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.targetRoomId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.targetRoomId = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.targetUserId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.targetUserId = options.longs === String ? "0" : 0;
                    object.targetBool = false;
                    object.targetInt = 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.targetLong = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.targetLong = options.longs === String ? "0" : 0;
                    if (options.bytes === String)
                        object.targetBytes = "";
                    else {
                        object.targetBytes = [];
                        if (options.bytes !== Array)
                            object.targetBytes = $util.newBuffer(object.targetBytes);
                    }
                    object.targetText = "";
                    object.combinedInfo = null;
                    object.pushingStatus = options.enums === String ? "PUSHING_NONE" : 0;
                    object.mood = options.enums === String ? "ACTIVE" : 0;
                    object.chatInfo = null;
                    object.mediaInfo = null;
                    object.exerciseInfo = null;
                }
                if (message.version != null && message.hasOwnProperty("version"))
                    object.version = options.bytes === String ? $util.base64.encode(message.version, 0, message.version.length) : options.bytes === Array ? Array.prototype.slice.call(message.version) : message.version;
                if (message.msgType != null && message.hasOwnProperty("msgType"))
                    object.msgType = options.enums === String ? $root.MsgProto.EnumMsgType[message.msgType] : message.msgType;
                if (message.classRoomStatus != null && message.hasOwnProperty("classRoomStatus"))
                    object.classRoomStatus = options.enums === String ? $root.MsgProto.EnumClassRoomStatus[message.classRoomStatus] : message.classRoomStatus;
                if (message.chatEnabled != null && message.hasOwnProperty("chatEnabled"))
                    object.chatEnabled = message.chatEnabled;
                if (message.targetRoomId != null && message.hasOwnProperty("targetRoomId"))
                    if (typeof message.targetRoomId === "number")
                        object.targetRoomId = options.longs === String ? String(message.targetRoomId) : message.targetRoomId;
                    else
                        object.targetRoomId = options.longs === String ? $util.Long.prototype.toString.call(message.targetRoomId) : options.longs === Number ? new $util.LongBits(message.targetRoomId.low >>> 0, message.targetRoomId.high >>> 0).toNumber() : message.targetRoomId;
                if (message.targetGroupRoomIds && message.targetGroupRoomIds.length) {
                    object.targetGroupRoomIds = [];
                    for (var j = 0; j < message.targetGroupRoomIds.length; ++j)
                        if (typeof message.targetGroupRoomIds[j] === "number")
                            object.targetGroupRoomIds[j] = options.longs === String ? String(message.targetGroupRoomIds[j]) : message.targetGroupRoomIds[j];
                        else
                            object.targetGroupRoomIds[j] = options.longs === String ? $util.Long.prototype.toString.call(message.targetGroupRoomIds[j]) : options.longs === Number ? new $util.LongBits(message.targetGroupRoomIds[j].low >>> 0, message.targetGroupRoomIds[j].high >>> 0).toNumber() : message.targetGroupRoomIds[j];
                }
                if (message.targetUserId != null && message.hasOwnProperty("targetUserId"))
                    if (typeof message.targetUserId === "number")
                        object.targetUserId = options.longs === String ? String(message.targetUserId) : message.targetUserId;
                    else
                        object.targetUserId = options.longs === String ? $util.Long.prototype.toString.call(message.targetUserId) : options.longs === Number ? new $util.LongBits(message.targetUserId.low >>> 0, message.targetUserId.high >>> 0).toNumber() : message.targetUserId;
                if (message.targetGroupUserIds && message.targetGroupUserIds.length) {
                    object.targetGroupUserIds = [];
                    for (var j = 0; j < message.targetGroupUserIds.length; ++j)
                        if (typeof message.targetGroupUserIds[j] === "number")
                            object.targetGroupUserIds[j] = options.longs === String ? String(message.targetGroupUserIds[j]) : message.targetGroupUserIds[j];
                        else
                            object.targetGroupUserIds[j] = options.longs === String ? $util.Long.prototype.toString.call(message.targetGroupUserIds[j]) : options.longs === Number ? new $util.LongBits(message.targetGroupUserIds[j].low >>> 0, message.targetGroupUserIds[j].high >>> 0).toNumber() : message.targetGroupUserIds[j];
                }
                if (message.targetBool != null && message.hasOwnProperty("targetBool"))
                    object.targetBool = message.targetBool;
                if (message.targetInt != null && message.hasOwnProperty("targetInt"))
                    object.targetInt = message.targetInt;
                if (message.targetLong != null && message.hasOwnProperty("targetLong"))
                    if (typeof message.targetLong === "number")
                        object.targetLong = options.longs === String ? String(message.targetLong) : message.targetLong;
                    else
                        object.targetLong = options.longs === String ? $util.Long.prototype.toString.call(message.targetLong) : options.longs === Number ? new $util.LongBits(message.targetLong.low >>> 0, message.targetLong.high >>> 0).toNumber() : message.targetLong;
                if (message.targetBytes != null && message.hasOwnProperty("targetBytes"))
                    object.targetBytes = options.bytes === String ? $util.base64.encode(message.targetBytes, 0, message.targetBytes.length) : options.bytes === Array ? Array.prototype.slice.call(message.targetBytes) : message.targetBytes;
                if (message.targetText != null && message.hasOwnProperty("targetText"))
                    object.targetText = message.targetText;
                if (message.userInfoList && message.userInfoList.length) {
                    object.userInfoList = [];
                    for (var j = 0; j < message.userInfoList.length; ++j)
                        object.userInfoList[j] = $root.MsgProto.UserInfo.toObject(message.userInfoList[j], options);
                }
                if (message.userStatusList && message.userStatusList.length) {
                    object.userStatusList = [];
                    for (var j = 0; j < message.userStatusList.length; ++j)
                        object.userStatusList[j] = $root.MsgProto.UserStatus.toObject(message.userStatusList[j], options);
                }
                if (message.combinedInfo != null && message.hasOwnProperty("combinedInfo"))
                    object.combinedInfo = $root.MsgProto.CombinedInfo.toObject(message.combinedInfo, options);
                if (message.pushingStatus != null && message.hasOwnProperty("pushingStatus"))
                    object.pushingStatus = options.enums === String ? $root.MsgProto.EnumPushingStatus[message.pushingStatus] : message.pushingStatus;
                if (message.mood != null && message.hasOwnProperty("mood"))
                    object.mood = options.enums === String ? $root.MsgProto.EnumMood[message.mood] : message.mood;
                if (message.chatInfo != null && message.hasOwnProperty("chatInfo"))
                    object.chatInfo = $root.MsgProto.ChatInfo.toObject(message.chatInfo, options);
                if (message.chatInfoList && message.chatInfoList.length) {
                    object.chatInfoList = [];
                    for (var j = 0; j < message.chatInfoList.length; ++j)
                        object.chatInfoList[j] = $root.MsgProto.ChatInfo.toObject(message.chatInfoList[j], options);
                }
                if (message.mediaInfo != null && message.hasOwnProperty("mediaInfo"))
                    object.mediaInfo = $root.MsgProto.MediaInfo.toObject(message.mediaInfo, options);
                if (message.exerciseInfo != null && message.hasOwnProperty("exerciseInfo"))
                    object.exerciseInfo = $root.MsgProto.ExerciseInfo.toObject(message.exerciseInfo, options);
                if (message.exerciseSubmitList && message.exerciseSubmitList.length) {
                    object.exerciseSubmitList = [];
                    for (var j = 0; j < message.exerciseSubmitList.length; ++j)
                        object.exerciseSubmitList[j] = $root.MsgProto.ExerciseSubmit.toObject(message.exerciseSubmitList[j], options);
                }
                return object;
            };
    
            /**
             * Converts this Msg to JSON.
             * @function toJSON
             * @memberof MsgProto.Msg
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Msg.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return Msg;
        })();
    
        /**
         * EnumMsgTarget enum.
         * @name MsgProto.EnumMsgTarget
         * @enum {number}
         * @property {number} MSG_TO_NONE=0 MSG_TO_NONE value
         * @property {number} MSG_TO_SENDER=1 MSG_TO_SENDER value
         * @property {number} MSG_TO_TARGET=2 MSG_TO_TARGET value
         * @property {number} MSG_TO_GROUP=3 MSG_TO_GROUP value
         * @property {number} MSG_TO_ALL_EXCEPT_SENDER=4 MSG_TO_ALL_EXCEPT_SENDER value
         * @property {number} MSG_TO_ALL=5 MSG_TO_ALL value
         * @property {number} MSG_TO_ROOM_TARGET=6 MSG_TO_ROOM_TARGET value
         * @property {number} MSG_TO_ROOM_GROUP=7 MSG_TO_ROOM_GROUP value
         * @property {number} MSG_TO_ROOMS_ALL=8 MSG_TO_ROOMS_ALL value
         * @property {number} MSG_TO_ALL_ROOMS_DANGER=99 MSG_TO_ALL_ROOMS_DANGER value
         */
        MsgProto.EnumMsgTarget = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "MSG_TO_NONE"] = 0;
            values[valuesById[1] = "MSG_TO_SENDER"] = 1;
            values[valuesById[2] = "MSG_TO_TARGET"] = 2;
            values[valuesById[3] = "MSG_TO_GROUP"] = 3;
            values[valuesById[4] = "MSG_TO_ALL_EXCEPT_SENDER"] = 4;
            values[valuesById[5] = "MSG_TO_ALL"] = 5;
            values[valuesById[6] = "MSG_TO_ROOM_TARGET"] = 6;
            values[valuesById[7] = "MSG_TO_ROOM_GROUP"] = 7;
            values[valuesById[8] = "MSG_TO_ROOMS_ALL"] = 8;
            values[valuesById[99] = "MSG_TO_ALL_ROOMS_DANGER"] = 99;
            return values;
        })();
    
        /**
         * EnumMsgType enum.
         * @name MsgProto.EnumMsgType
         * @enum {number}
         * @property {number} MSG_UNKNOWN=0 MSG_UNKNOWN value
         * @property {number} MSG_PONG=1 MSG_PONG value
         * @property {number} MSG_TO_ALL__USER_STATUS_PARTIAL=11 MSG_TO_ALL__USER_STATUS_PARTIAL value
         * @property {number} MSG_TO_ALL__USER_STATUS=12 MSG_TO_ALL__USER_STATUS value
         * @property {number} MSG_TO_ALL__ONLINE__USER_STATUS_PARTIAL=13 MSG_TO_ALL__ONLINE__USER_STATUS_PARTIAL value
         * @property {number} MSG_TO_ALL__START_CLASS=14 MSG_TO_ALL__START_CLASS value
         * @property {number} MSG_TO_ALL__END_CLASS=15 MSG_TO_ALL__END_CLASS value
         * @property {number} MSG_TO_ALL__REST=16 MSG_TO_ALL__REST value
         * @property {number} MSG_TO_ALL__REST_CANCEL=17 MSG_TO_ALL__REST_CANCEL value
         * @property {number} MSG_TO_ALL__TEACHER_SWITCH__USER_STATUS_PARTIAL=31 MSG_TO_ALL__TEACHER_SWITCH__USER_STATUS_PARTIAL value
         * @property {number} MSG_TO_ALL__HANDS_UP__USER_STATUS_PARTIAL=32 MSG_TO_ALL__HANDS_UP__USER_STATUS_PARTIAL value
         * @property {number} MSG_TO_ALL__LEARN_STATUS__USER_STATUS_PARTIAL=33 MSG_TO_ALL__LEARN_STATUS__USER_STATUS_PARTIAL value
         * @property {number} MSG_TO_ALL__PUSHING_STATUS__USER_STATUS_PARTIAL=34 MSG_TO_ALL__PUSHING_STATUS__USER_STATUS_PARTIAL value
         * @property {number} MSG_TO_ALL__SHARING_STATUS__USER_STATUS_PARTIAL=35 MSG_TO_ALL__SHARING_STATUS__USER_STATUS_PARTIAL value
         * @property {number} MSG_TO_ALL__MUTE_AUDIO__USER_STATUS_PARTIAL=36 MSG_TO_ALL__MUTE_AUDIO__USER_STATUS_PARTIAL value
         * @property {number} MSG_TO_ALL__FULLSCREEN__USER_STATUS_PARTIAL=37 MSG_TO_ALL__FULLSCREEN__USER_STATUS_PARTIAL value
         * @property {number} MSG_TO_ALL__WHITEBOARD__USER_STATUS_PARTIAL=38 MSG_TO_ALL__WHITEBOARD__USER_STATUS_PARTIAL value
         * @property {number} MSG_TO_ALL__COMBINED__USER_STATUS_PARTIAL=39 MSG_TO_ALL__COMBINED__USER_STATUS_PARTIAL value
         * @property {number} MSG_TO_ALL__ALL_HANDS_DOWN__USER_STATUS_PARTIAL=51 MSG_TO_ALL__ALL_HANDS_DOWN__USER_STATUS_PARTIAL value
         * @property {number} MSG_TO_ALL__ALL_MUTE__USER_STATUS_PARTIAL=52 MSG_TO_ALL__ALL_MUTE__USER_STATUS_PARTIAL value
         * @property {number} MSG_TO_ALL__KICK_ALL_EXIT_ROOM=53 MSG_TO_ALL__KICK_ALL_EXIT_ROOM value
         * @property {number} MSG_TO_ALL__AWARD_SINGLE__USER_STATUS_PARTIAL=71 MSG_TO_ALL__AWARD_SINGLE__USER_STATUS_PARTIAL value
         * @property {number} MSG_TO_ALL__AWARD_GROUP__USER_STATUS_PARTIAL=72 MSG_TO_ALL__AWARD_GROUP__USER_STATUS_PARTIAL value
         * @property {number} MSG_TO_ALL__AWARD_ONLINE__USER_STATUS_PARTIAL=73 MSG_TO_ALL__AWARD_ONLINE__USER_STATUS_PARTIAL value
         * @property {number} MSG_TO_ALL__AWARD_ALL__USER_STATUS_PARTIAL=74 MSG_TO_ALL__AWARD_ALL__USER_STATUS_PARTIAL value
         * @property {number} MSG_TO_ALL__EXERCISE_OPEN=101 MSG_TO_ALL__EXERCISE_OPEN value
         * @property {number} MSG_TO_ALL__EXERCISE_CLOSE=102 MSG_TO_ALL__EXERCISE_CLOSE value
         * @property {number} MSG_TO_ALL__EXERCISE_SUBMIT=103 MSG_TO_ALL__EXERCISE_SUBMIT value
         * @property {number} MSG_TO_ALL__IM_TEXT=131 MSG_TO_ALL__IM_TEXT value
         * @property {number} MSG_TO_ALL__IM_STATUS=132 MSG_TO_ALL__IM_STATUS value
         * @property {number} MSG_TO_ALL__MEDIA_OPEN=161 MSG_TO_ALL__MEDIA_OPEN value
         * @property {number} MSG_TO_ALL__MEDIA_CLOSE=162 MSG_TO_ALL__MEDIA_CLOSE value
         * @property {number} MSG_TO_NONE__DUMMY=201 MSG_TO_NONE__DUMMY value
         * @property {number} MSG_TO_NONE__MEDIA_UPDATE_POSITION=202 MSG_TO_NONE__MEDIA_UPDATE_POSITION value
         * @property {number} MSG_TO_NONE__KICK_PUSHING=203 MSG_TO_NONE__KICK_PUSHING value
         * @property {number} MSG_TO_NONE__UPDATE_USER_INFO=204 MSG_TO_NONE__UPDATE_USER_INFO value
         * @property {number} MSG_TO_NONE__UPDATE_ALL_STATUS=205 MSG_TO_NONE__UPDATE_ALL_STATUS value
         * @property {number} MSG_TO_SENDER__USER_STATUS_PARTIAL=251 MSG_TO_SENDER__USER_STATUS_PARTIAL value
         * @property {number} MSG_TO_SENDER__HANDSHAKE_SUCCESS=252 MSG_TO_SENDER__HANDSHAKE_SUCCESS value
         * @property {number} MSG_TO_SENDER__ROOM_INFO=253 MSG_TO_SENDER__ROOM_INFO value
         * @property {number} MSG_TO_SENDER__USER_INFO=254 MSG_TO_SENDER__USER_INFO value
         * @property {number} MSG_TO_SENDER__USER_STATUS=255 MSG_TO_SENDER__USER_STATUS value
         * @property {number} MSG_TO_SENDER__VERSION_CHECK=256 MSG_TO_SENDER__VERSION_CHECK value
         * @property {number} MSG_TO_SENDER__KICK_BY_NOT_RIGHT_TIME=257 MSG_TO_SENDER__KICK_BY_NOT_RIGHT_TIME value
         * @property {number} MSG_TO_SENDER__KICK_BY_ROOM_FULL=258 MSG_TO_SENDER__KICK_BY_ROOM_FULL value
         * @property {number} MSG_TO_TARGET__USER_STATUS_PARTIAL=301 MSG_TO_TARGET__USER_STATUS_PARTIAL value
         * @property {number} MSG_TO_TARGET__ZOOM_CAMERA=302 MSG_TO_TARGET__ZOOM_CAMERA value
         * @property {number} MSG_TO_TARGET__KICK_EXIT_ROOM=303 MSG_TO_TARGET__KICK_EXIT_ROOM value
         * @property {number} MSG_TO_TARGET__KICK_BY_LOGIN_EXPIRE=304 MSG_TO_TARGET__KICK_BY_LOGIN_EXPIRE value
         * @property {number} MSG_TO_GROUP_KICK_ALL_STUDENT_EXIT_ROOM=351 MSG_TO_GROUP_KICK_ALL_STUDENT_EXIT_ROOM value
         * @property {number} MSG_TO_ALL_EXCEPT_SENDER__MEDIA_CHANGE_POSITION=401 MSG_TO_ALL_EXCEPT_SENDER__MEDIA_CHANGE_POSITION value
         * @property {number} MSG_TO_ALL_EXCEPT_SENDER__MEDIA_PAUSE=402 MSG_TO_ALL_EXCEPT_SENDER__MEDIA_PAUSE value
         * @property {number} MSG_TO_ALL_EXCEPT_SENDER__UPDATE_SINGLE_USER_INFO=403 MSG_TO_ALL_EXCEPT_SENDER__UPDATE_SINGLE_USER_INFO value
         */
        MsgProto.EnumMsgType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "MSG_UNKNOWN"] = 0;
            values[valuesById[1] = "MSG_PONG"] = 1;
            values[valuesById[11] = "MSG_TO_ALL__USER_STATUS_PARTIAL"] = 11;
            values[valuesById[12] = "MSG_TO_ALL__USER_STATUS"] = 12;
            values[valuesById[13] = "MSG_TO_ALL__ONLINE__USER_STATUS_PARTIAL"] = 13;
            values[valuesById[14] = "MSG_TO_ALL__START_CLASS"] = 14;
            values[valuesById[15] = "MSG_TO_ALL__END_CLASS"] = 15;
            values[valuesById[16] = "MSG_TO_ALL__REST"] = 16;
            values[valuesById[17] = "MSG_TO_ALL__REST_CANCEL"] = 17;
            values[valuesById[31] = "MSG_TO_ALL__TEACHER_SWITCH__USER_STATUS_PARTIAL"] = 31;
            values[valuesById[32] = "MSG_TO_ALL__HANDS_UP__USER_STATUS_PARTIAL"] = 32;
            values[valuesById[33] = "MSG_TO_ALL__LEARN_STATUS__USER_STATUS_PARTIAL"] = 33;
            values[valuesById[34] = "MSG_TO_ALL__PUSHING_STATUS__USER_STATUS_PARTIAL"] = 34;
            values[valuesById[35] = "MSG_TO_ALL__SHARING_STATUS__USER_STATUS_PARTIAL"] = 35;
            values[valuesById[36] = "MSG_TO_ALL__MUTE_AUDIO__USER_STATUS_PARTIAL"] = 36;
            values[valuesById[37] = "MSG_TO_ALL__FULLSCREEN__USER_STATUS_PARTIAL"] = 37;
            values[valuesById[38] = "MSG_TO_ALL__WHITEBOARD__USER_STATUS_PARTIAL"] = 38;
            values[valuesById[39] = "MSG_TO_ALL__COMBINED__USER_STATUS_PARTIAL"] = 39;
            values[valuesById[51] = "MSG_TO_ALL__ALL_HANDS_DOWN__USER_STATUS_PARTIAL"] = 51;
            values[valuesById[52] = "MSG_TO_ALL__ALL_MUTE__USER_STATUS_PARTIAL"] = 52;
            values[valuesById[53] = "MSG_TO_ALL__KICK_ALL_EXIT_ROOM"] = 53;
            values[valuesById[71] = "MSG_TO_ALL__AWARD_SINGLE__USER_STATUS_PARTIAL"] = 71;
            values[valuesById[72] = "MSG_TO_ALL__AWARD_GROUP__USER_STATUS_PARTIAL"] = 72;
            values[valuesById[73] = "MSG_TO_ALL__AWARD_ONLINE__USER_STATUS_PARTIAL"] = 73;
            values[valuesById[74] = "MSG_TO_ALL__AWARD_ALL__USER_STATUS_PARTIAL"] = 74;
            values[valuesById[101] = "MSG_TO_ALL__EXERCISE_OPEN"] = 101;
            values[valuesById[102] = "MSG_TO_ALL__EXERCISE_CLOSE"] = 102;
            values[valuesById[103] = "MSG_TO_ALL__EXERCISE_SUBMIT"] = 103;
            values[valuesById[131] = "MSG_TO_ALL__IM_TEXT"] = 131;
            values[valuesById[132] = "MSG_TO_ALL__IM_STATUS"] = 132;
            values[valuesById[161] = "MSG_TO_ALL__MEDIA_OPEN"] = 161;
            values[valuesById[162] = "MSG_TO_ALL__MEDIA_CLOSE"] = 162;
            values[valuesById[201] = "MSG_TO_NONE__DUMMY"] = 201;
            values[valuesById[202] = "MSG_TO_NONE__MEDIA_UPDATE_POSITION"] = 202;
            values[valuesById[203] = "MSG_TO_NONE__KICK_PUSHING"] = 203;
            values[valuesById[204] = "MSG_TO_NONE__UPDATE_USER_INFO"] = 204;
            values[valuesById[205] = "MSG_TO_NONE__UPDATE_ALL_STATUS"] = 205;
            values[valuesById[251] = "MSG_TO_SENDER__USER_STATUS_PARTIAL"] = 251;
            values[valuesById[252] = "MSG_TO_SENDER__HANDSHAKE_SUCCESS"] = 252;
            values[valuesById[253] = "MSG_TO_SENDER__ROOM_INFO"] = 253;
            values[valuesById[254] = "MSG_TO_SENDER__USER_INFO"] = 254;
            values[valuesById[255] = "MSG_TO_SENDER__USER_STATUS"] = 255;
            values[valuesById[256] = "MSG_TO_SENDER__VERSION_CHECK"] = 256;
            values[valuesById[257] = "MSG_TO_SENDER__KICK_BY_NOT_RIGHT_TIME"] = 257;
            values[valuesById[258] = "MSG_TO_SENDER__KICK_BY_ROOM_FULL"] = 258;
            values[valuesById[301] = "MSG_TO_TARGET__USER_STATUS_PARTIAL"] = 301;
            values[valuesById[302] = "MSG_TO_TARGET__ZOOM_CAMERA"] = 302;
            values[valuesById[303] = "MSG_TO_TARGET__KICK_EXIT_ROOM"] = 303;
            values[valuesById[304] = "MSG_TO_TARGET__KICK_BY_LOGIN_EXPIRE"] = 304;
            values[valuesById[351] = "MSG_TO_GROUP_KICK_ALL_STUDENT_EXIT_ROOM"] = 351;
            values[valuesById[401] = "MSG_TO_ALL_EXCEPT_SENDER__MEDIA_CHANGE_POSITION"] = 401;
            values[valuesById[402] = "MSG_TO_ALL_EXCEPT_SENDER__MEDIA_PAUSE"] = 402;
            values[valuesById[403] = "MSG_TO_ALL_EXCEPT_SENDER__UPDATE_SINGLE_USER_INFO"] = 403;
            return values;
        })();
    
        /**
         * EnumClassRoomStatus enum.
         * @name MsgProto.EnumClassRoomStatus
         * @enum {number}
         * @property {number} NOT_STARTED=0 NOT_STARTED value
         * @property {number} STARTING=1 STARTING value
         * @property {number} STARTED=2 STARTED value
         * @property {number} STARTED_REST=3 STARTED_REST value
         * @property {number} ENDING=98 ENDING value
         * @property {number} END=99 END value
         */
        MsgProto.EnumClassRoomStatus = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "NOT_STARTED"] = 0;
            values[valuesById[1] = "STARTING"] = 1;
            values[valuesById[2] = "STARTED"] = 2;
            values[valuesById[3] = "STARTED_REST"] = 3;
            values[valuesById[98] = "ENDING"] = 98;
            values[valuesById[99] = "END"] = 99;
            return values;
        })();
    
        /**
         * EnumUserType enum.
         * @name MsgProto.EnumUserType
         * @enum {number}
         * @property {number} UNKNOWN=0 UNKNOWN value
         * @property {number} INSPECTOR=1 INSPECTOR value
         * @property {number} TEACHER=2 TEACHER value
         * @property {number} STUDENT=3 STUDENT value
         * @property {number} TEACHER_BACKSTAGE=4 TEACHER_BACKSTAGE value
         * @property {number} ADMIN=5 ADMIN value
         */
        MsgProto.EnumUserType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "UNKNOWN"] = 0;
            values[valuesById[1] = "INSPECTOR"] = 1;
            values[valuesById[2] = "TEACHER"] = 2;
            values[valuesById[3] = "STUDENT"] = 3;
            values[valuesById[4] = "TEACHER_BACKSTAGE"] = 4;
            values[valuesById[5] = "ADMIN"] = 5;
            return values;
        })();
    
        /**
         * EnumPushingStatus enum.
         * @name MsgProto.EnumPushingStatus
         * @enum {number}
         * @property {number} PUSHING_NONE=0 PUSHING_NONE value
         * @property {number} PUSHING_AUDIO=1 PUSHING_AUDIO value
         * @property {number} PUSHING_FRONT=2 PUSHING_FRONT value
         * @property {number} PUSHING_BACK=3 PUSHING_BACK value
         */
        MsgProto.EnumPushingStatus = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "PUSHING_NONE"] = 0;
            values[valuesById[1] = "PUSHING_AUDIO"] = 1;
            values[valuesById[2] = "PUSHING_FRONT"] = 2;
            values[valuesById[3] = "PUSHING_BACK"] = 3;
            return values;
        })();
    
        /**
         * EnumMood enum.
         * @name MsgProto.EnumMood
         * @enum {number}
         * @property {number} ACTIVE=0 ACTIVE value
         * @property {number} HARDWORKING=1 HARDWORKING value
         * @property {number} NORMAL=2 NORMAL value
         * @property {number} WONDERING=3 WONDERING value
         */
        MsgProto.EnumMood = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "ACTIVE"] = 0;
            values[valuesById[1] = "HARDWORKING"] = 1;
            values[valuesById[2] = "NORMAL"] = 2;
            values[valuesById[3] = "WONDERING"] = 3;
            return values;
        })();
    
        /**
         * EnumDeviceType enum.
         * @name MsgProto.EnumDeviceType
         * @enum {number}
         * @property {number} UNKNOWN_DEVICE=0 UNKNOWN_DEVICE value
         * @property {number} MOBILE_IOS=1 MOBILE_IOS value
         * @property {number} MOBILE_ANDROID=2 MOBILE_ANDROID value
         * @property {number} TABLET_IOS=3 TABLET_IOS value
         * @property {number} TABLET_ANDROID=4 TABLET_ANDROID value
         * @property {number} DESKTOP_WINDOWS=5 DESKTOP_WINDOWS value
         * @property {number} DESKTOP_MAC=6 DESKTOP_MAC value
         * @property {number} WEB=7 WEB value
         */
        MsgProto.EnumDeviceType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "UNKNOWN_DEVICE"] = 0;
            values[valuesById[1] = "MOBILE_IOS"] = 1;
            values[valuesById[2] = "MOBILE_ANDROID"] = 2;
            values[valuesById[3] = "TABLET_IOS"] = 3;
            values[valuesById[4] = "TABLET_ANDROID"] = 4;
            values[valuesById[5] = "DESKTOP_WINDOWS"] = 5;
            values[valuesById[6] = "DESKTOP_MAC"] = 6;
            values[valuesById[7] = "WEB"] = 7;
            return values;
        })();
    
        /**
         * EnumMediaType enum.
         * @name MsgProto.EnumMediaType
         * @enum {number}
         * @property {number} AUDIO=0 AUDIO value
         * @property {number} VIDEO=1 VIDEO value
         */
        MsgProto.EnumMediaType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "AUDIO"] = 0;
            values[valuesById[1] = "VIDEO"] = 1;
            return values;
        })();
    
        /**
         * EnumAwardType enum.
         * @name MsgProto.EnumAwardType
         * @enum {number}
         * @property {number} NONE=0 NONE value
         * @property {number} SINGLE=1 SINGLE value
         * @property {number} GROUP=2 GROUP value
         * @property {number} ONLINE=3 ONLINE value
         * @property {number} ALL=4 ALL value
         */
        MsgProto.EnumAwardType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "NONE"] = 0;
            values[valuesById[1] = "SINGLE"] = 1;
            values[valuesById[2] = "GROUP"] = 2;
            values[valuesById[3] = "ONLINE"] = 3;
            values[valuesById[4] = "ALL"] = 4;
            return values;
        })();
    
        /**
         * EnumCameraType enum.
         * @name MsgProto.EnumCameraType
         * @enum {number}
         * @property {number} FRONT=0 FRONT value
         * @property {number} BACK=1 BACK value
         */
        MsgProto.EnumCameraType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "FRONT"] = 0;
            values[valuesById[1] = "BACK"] = 1;
            return values;
        })();
    
        MsgProto.UserInfo = (function() {
    
            /**
             * Properties of a UserInfo.
             * @memberof MsgProto
             * @interface IUserInfo
             * @property {Long|null} [id] UserInfo id
             * @property {string|null} [name] UserInfo name
             * @property {string|null} [avatar] UserInfo avatar
             * @property {number|null} [agoraId] UserInfo agoraId
             * @property {number|null} [agoraShareId] UserInfo agoraShareId
             */
    
            /**
             * Constructs a new UserInfo.
             * @memberof MsgProto
             * @classdesc Represents a UserInfo.
             * @implements IUserInfo
             * @constructor
             * @param {MsgProto.IUserInfo=} [properties] Properties to set
             */
            function UserInfo(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * UserInfo id.
             * @member {Long} id
             * @memberof MsgProto.UserInfo
             * @instance
             */
            UserInfo.prototype.id = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
            /**
             * UserInfo name.
             * @member {string} name
             * @memberof MsgProto.UserInfo
             * @instance
             */
            UserInfo.prototype.name = "";
    
            /**
             * UserInfo avatar.
             * @member {string} avatar
             * @memberof MsgProto.UserInfo
             * @instance
             */
            UserInfo.prototype.avatar = "";
    
            /**
             * UserInfo agoraId.
             * @member {number} agoraId
             * @memberof MsgProto.UserInfo
             * @instance
             */
            UserInfo.prototype.agoraId = 0;
    
            /**
             * UserInfo agoraShareId.
             * @member {number} agoraShareId
             * @memberof MsgProto.UserInfo
             * @instance
             */
            UserInfo.prototype.agoraShareId = 0;
    
            /**
             * Creates a new UserInfo instance using the specified properties.
             * @function create
             * @memberof MsgProto.UserInfo
             * @static
             * @param {MsgProto.IUserInfo=} [properties] Properties to set
             * @returns {MsgProto.UserInfo} UserInfo instance
             */
            UserInfo.create = function create(properties) {
                return new UserInfo(properties);
            };
    
            /**
             * Encodes the specified UserInfo message. Does not implicitly {@link MsgProto.UserInfo.verify|verify} messages.
             * @function encode
             * @memberof MsgProto.UserInfo
             * @static
             * @param {MsgProto.IUserInfo} message UserInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UserInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.id);
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                if (message.avatar != null && Object.hasOwnProperty.call(message, "avatar"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.avatar);
                if (message.agoraId != null && Object.hasOwnProperty.call(message, "agoraId"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.agoraId);
                if (message.agoraShareId != null && Object.hasOwnProperty.call(message, "agoraShareId"))
                    writer.uint32(/* id 5, wireType 0 =*/40).int32(message.agoraShareId);
                return writer;
            };
    
            /**
             * Encodes the specified UserInfo message, length delimited. Does not implicitly {@link MsgProto.UserInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof MsgProto.UserInfo
             * @static
             * @param {MsgProto.IUserInfo} message UserInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UserInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a UserInfo message from the specified reader or buffer.
             * @function decode
             * @memberof MsgProto.UserInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {MsgProto.UserInfo} UserInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UserInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MsgProto.UserInfo();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.fixed64();
                        break;
                    case 2:
                        message.name = reader.string();
                        break;
                    case 3:
                        message.avatar = reader.string();
                        break;
                    case 4:
                        message.agoraId = reader.int32();
                        break;
                    case 5:
                        message.agoraShareId = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a UserInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof MsgProto.UserInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {MsgProto.UserInfo} UserInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UserInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a UserInfo message.
             * @function verify
             * @memberof MsgProto.UserInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UserInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                        return "id: integer|Long expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.avatar != null && message.hasOwnProperty("avatar"))
                    if (!$util.isString(message.avatar))
                        return "avatar: string expected";
                if (message.agoraId != null && message.hasOwnProperty("agoraId"))
                    if (!$util.isInteger(message.agoraId))
                        return "agoraId: integer expected";
                if (message.agoraShareId != null && message.hasOwnProperty("agoraShareId"))
                    if (!$util.isInteger(message.agoraShareId))
                        return "agoraShareId: integer expected";
                return null;
            };
    
            /**
             * Creates a UserInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof MsgProto.UserInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {MsgProto.UserInfo} UserInfo
             */
            UserInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.MsgProto.UserInfo)
                    return object;
                var message = new $root.MsgProto.UserInfo();
                if (object.id != null)
                    if ($util.Long)
                        (message.id = $util.Long.fromValue(object.id)).unsigned = false;
                    else if (typeof object.id === "string")
                        message.id = parseInt(object.id, 10);
                    else if (typeof object.id === "number")
                        message.id = object.id;
                    else if (typeof object.id === "object")
                        message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber();
                if (object.name != null)
                    message.name = String(object.name);
                if (object.avatar != null)
                    message.avatar = String(object.avatar);
                if (object.agoraId != null)
                    message.agoraId = object.agoraId | 0;
                if (object.agoraShareId != null)
                    message.agoraShareId = object.agoraShareId | 0;
                return message;
            };
    
            /**
             * Creates a plain object from a UserInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof MsgProto.UserInfo
             * @static
             * @param {MsgProto.UserInfo} message UserInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UserInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.id = options.longs === String ? "0" : 0;
                    object.name = "";
                    object.avatar = "";
                    object.agoraId = 0;
                    object.agoraShareId = 0;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    if (typeof message.id === "number")
                        object.id = options.longs === String ? String(message.id) : message.id;
                    else
                        object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber() : message.id;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.avatar != null && message.hasOwnProperty("avatar"))
                    object.avatar = message.avatar;
                if (message.agoraId != null && message.hasOwnProperty("agoraId"))
                    object.agoraId = message.agoraId;
                if (message.agoraShareId != null && message.hasOwnProperty("agoraShareId"))
                    object.agoraShareId = message.agoraShareId;
                return object;
            };
    
            /**
             * Converts this UserInfo to JSON.
             * @function toJSON
             * @memberof MsgProto.UserInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UserInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return UserInfo;
        })();
    
        MsgProto.UserStatus = (function() {
    
            /**
             * Properties of a UserStatus.
             * @memberof MsgProto
             * @interface IUserStatus
             * @property {Long|null} [id] UserStatus id
             * @property {MsgProto.EnumUserType|null} [userType] UserStatus userType
             * @property {boolean|null} [online] UserStatus online
             * @property {boolean|null} [handsUp] UserStatus handsUp
             * @property {MsgProto.EnumPushingStatus|null} [pushingStatus] UserStatus pushingStatus
             * @property {boolean|null} [sharingScreen] UserStatus sharingScreen
             * @property {boolean|null} [muteAudio] UserStatus muteAudio
             * @property {boolean|null} [fullscreen] UserStatus fullscreen
             * @property {boolean|null} [whiteBoard] UserStatus whiteBoard
             * @property {MsgProto.EnumDeviceType|null} [deviceType] UserStatus deviceType
             * @property {number|null} [group] UserStatus group
             * @property {number|null} [medals] UserStatus medals
             * @property {MsgProto.EnumMood|null} [mood] UserStatus mood
             */
    
            /**
             * Constructs a new UserStatus.
             * @memberof MsgProto
             * @classdesc Represents a UserStatus.
             * @implements IUserStatus
             * @constructor
             * @param {MsgProto.IUserStatus=} [properties] Properties to set
             */
            function UserStatus(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * UserStatus id.
             * @member {Long} id
             * @memberof MsgProto.UserStatus
             * @instance
             */
            UserStatus.prototype.id = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
            /**
             * UserStatus userType.
             * @member {MsgProto.EnumUserType} userType
             * @memberof MsgProto.UserStatus
             * @instance
             */
            UserStatus.prototype.userType = 0;
    
            /**
             * UserStatus online.
             * @member {boolean} online
             * @memberof MsgProto.UserStatus
             * @instance
             */
            UserStatus.prototype.online = false;
    
            /**
             * UserStatus handsUp.
             * @member {boolean} handsUp
             * @memberof MsgProto.UserStatus
             * @instance
             */
            UserStatus.prototype.handsUp = false;
    
            /**
             * UserStatus pushingStatus.
             * @member {MsgProto.EnumPushingStatus} pushingStatus
             * @memberof MsgProto.UserStatus
             * @instance
             */
            UserStatus.prototype.pushingStatus = 0;
    
            /**
             * UserStatus sharingScreen.
             * @member {boolean} sharingScreen
             * @memberof MsgProto.UserStatus
             * @instance
             */
            UserStatus.prototype.sharingScreen = false;
    
            /**
             * UserStatus muteAudio.
             * @member {boolean} muteAudio
             * @memberof MsgProto.UserStatus
             * @instance
             */
            UserStatus.prototype.muteAudio = false;
    
            /**
             * UserStatus fullscreen.
             * @member {boolean} fullscreen
             * @memberof MsgProto.UserStatus
             * @instance
             */
            UserStatus.prototype.fullscreen = false;
    
            /**
             * UserStatus whiteBoard.
             * @member {boolean} whiteBoard
             * @memberof MsgProto.UserStatus
             * @instance
             */
            UserStatus.prototype.whiteBoard = false;
    
            /**
             * UserStatus deviceType.
             * @member {MsgProto.EnumDeviceType} deviceType
             * @memberof MsgProto.UserStatus
             * @instance
             */
            UserStatus.prototype.deviceType = 0;
    
            /**
             * UserStatus group.
             * @member {number} group
             * @memberof MsgProto.UserStatus
             * @instance
             */
            UserStatus.prototype.group = 0;
    
            /**
             * UserStatus medals.
             * @member {number} medals
             * @memberof MsgProto.UserStatus
             * @instance
             */
            UserStatus.prototype.medals = 0;
    
            /**
             * UserStatus mood.
             * @member {MsgProto.EnumMood} mood
             * @memberof MsgProto.UserStatus
             * @instance
             */
            UserStatus.prototype.mood = 0;
    
            /**
             * Creates a new UserStatus instance using the specified properties.
             * @function create
             * @memberof MsgProto.UserStatus
             * @static
             * @param {MsgProto.IUserStatus=} [properties] Properties to set
             * @returns {MsgProto.UserStatus} UserStatus instance
             */
            UserStatus.create = function create(properties) {
                return new UserStatus(properties);
            };
    
            /**
             * Encodes the specified UserStatus message. Does not implicitly {@link MsgProto.UserStatus.verify|verify} messages.
             * @function encode
             * @memberof MsgProto.UserStatus
             * @static
             * @param {MsgProto.IUserStatus} message UserStatus message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UserStatus.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.id);
                if (message.userType != null && Object.hasOwnProperty.call(message, "userType"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.userType);
                if (message.online != null && Object.hasOwnProperty.call(message, "online"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.online);
                if (message.handsUp != null && Object.hasOwnProperty.call(message, "handsUp"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.handsUp);
                if (message.pushingStatus != null && Object.hasOwnProperty.call(message, "pushingStatus"))
                    writer.uint32(/* id 5, wireType 0 =*/40).int32(message.pushingStatus);
                if (message.sharingScreen != null && Object.hasOwnProperty.call(message, "sharingScreen"))
                    writer.uint32(/* id 6, wireType 0 =*/48).bool(message.sharingScreen);
                if (message.muteAudio != null && Object.hasOwnProperty.call(message, "muteAudio"))
                    writer.uint32(/* id 7, wireType 0 =*/56).bool(message.muteAudio);
                if (message.fullscreen != null && Object.hasOwnProperty.call(message, "fullscreen"))
                    writer.uint32(/* id 8, wireType 0 =*/64).bool(message.fullscreen);
                if (message.whiteBoard != null && Object.hasOwnProperty.call(message, "whiteBoard"))
                    writer.uint32(/* id 9, wireType 0 =*/72).bool(message.whiteBoard);
                if (message.deviceType != null && Object.hasOwnProperty.call(message, "deviceType"))
                    writer.uint32(/* id 10, wireType 0 =*/80).int32(message.deviceType);
                if (message.group != null && Object.hasOwnProperty.call(message, "group"))
                    writer.uint32(/* id 11, wireType 0 =*/88).int32(message.group);
                if (message.medals != null && Object.hasOwnProperty.call(message, "medals"))
                    writer.uint32(/* id 12, wireType 0 =*/96).int32(message.medals);
                if (message.mood != null && Object.hasOwnProperty.call(message, "mood"))
                    writer.uint32(/* id 13, wireType 0 =*/104).int32(message.mood);
                return writer;
            };
    
            /**
             * Encodes the specified UserStatus message, length delimited. Does not implicitly {@link MsgProto.UserStatus.verify|verify} messages.
             * @function encodeDelimited
             * @memberof MsgProto.UserStatus
             * @static
             * @param {MsgProto.IUserStatus} message UserStatus message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UserStatus.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a UserStatus message from the specified reader or buffer.
             * @function decode
             * @memberof MsgProto.UserStatus
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {MsgProto.UserStatus} UserStatus
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UserStatus.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MsgProto.UserStatus();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.fixed64();
                        break;
                    case 2:
                        message.userType = reader.int32();
                        break;
                    case 3:
                        message.online = reader.bool();
                        break;
                    case 4:
                        message.handsUp = reader.bool();
                        break;
                    case 5:
                        message.pushingStatus = reader.int32();
                        break;
                    case 6:
                        message.sharingScreen = reader.bool();
                        break;
                    case 7:
                        message.muteAudio = reader.bool();
                        break;
                    case 8:
                        message.fullscreen = reader.bool();
                        break;
                    case 9:
                        message.whiteBoard = reader.bool();
                        break;
                    case 10:
                        message.deviceType = reader.int32();
                        break;
                    case 11:
                        message.group = reader.int32();
                        break;
                    case 12:
                        message.medals = reader.int32();
                        break;
                    case 13:
                        message.mood = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a UserStatus message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof MsgProto.UserStatus
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {MsgProto.UserStatus} UserStatus
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UserStatus.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a UserStatus message.
             * @function verify
             * @memberof MsgProto.UserStatus
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UserStatus.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                        return "id: integer|Long expected";
                if (message.userType != null && message.hasOwnProperty("userType"))
                    switch (message.userType) {
                    default:
                        return "userType: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                        break;
                    }
                if (message.online != null && message.hasOwnProperty("online"))
                    if (typeof message.online !== "boolean")
                        return "online: boolean expected";
                if (message.handsUp != null && message.hasOwnProperty("handsUp"))
                    if (typeof message.handsUp !== "boolean")
                        return "handsUp: boolean expected";
                if (message.pushingStatus != null && message.hasOwnProperty("pushingStatus"))
                    switch (message.pushingStatus) {
                    default:
                        return "pushingStatus: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        break;
                    }
                if (message.sharingScreen != null && message.hasOwnProperty("sharingScreen"))
                    if (typeof message.sharingScreen !== "boolean")
                        return "sharingScreen: boolean expected";
                if (message.muteAudio != null && message.hasOwnProperty("muteAudio"))
                    if (typeof message.muteAudio !== "boolean")
                        return "muteAudio: boolean expected";
                if (message.fullscreen != null && message.hasOwnProperty("fullscreen"))
                    if (typeof message.fullscreen !== "boolean")
                        return "fullscreen: boolean expected";
                if (message.whiteBoard != null && message.hasOwnProperty("whiteBoard"))
                    if (typeof message.whiteBoard !== "boolean")
                        return "whiteBoard: boolean expected";
                if (message.deviceType != null && message.hasOwnProperty("deviceType"))
                    switch (message.deviceType) {
                    default:
                        return "deviceType: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        break;
                    }
                if (message.group != null && message.hasOwnProperty("group"))
                    if (!$util.isInteger(message.group))
                        return "group: integer expected";
                if (message.medals != null && message.hasOwnProperty("medals"))
                    if (!$util.isInteger(message.medals))
                        return "medals: integer expected";
                if (message.mood != null && message.hasOwnProperty("mood"))
                    switch (message.mood) {
                    default:
                        return "mood: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        break;
                    }
                return null;
            };
    
            /**
             * Creates a UserStatus message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof MsgProto.UserStatus
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {MsgProto.UserStatus} UserStatus
             */
            UserStatus.fromObject = function fromObject(object) {
                if (object instanceof $root.MsgProto.UserStatus)
                    return object;
                var message = new $root.MsgProto.UserStatus();
                if (object.id != null)
                    if ($util.Long)
                        (message.id = $util.Long.fromValue(object.id)).unsigned = false;
                    else if (typeof object.id === "string")
                        message.id = parseInt(object.id, 10);
                    else if (typeof object.id === "number")
                        message.id = object.id;
                    else if (typeof object.id === "object")
                        message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber();
                switch (object.userType) {
                case "UNKNOWN":
                case 0:
                    message.userType = 0;
                    break;
                case "INSPECTOR":
                case 1:
                    message.userType = 1;
                    break;
                case "TEACHER":
                case 2:
                    message.userType = 2;
                    break;
                case "STUDENT":
                case 3:
                    message.userType = 3;
                    break;
                case "TEACHER_BACKSTAGE":
                case 4:
                    message.userType = 4;
                    break;
                case "ADMIN":
                case 5:
                    message.userType = 5;
                    break;
                }
                if (object.online != null)
                    message.online = Boolean(object.online);
                if (object.handsUp != null)
                    message.handsUp = Boolean(object.handsUp);
                switch (object.pushingStatus) {
                case "PUSHING_NONE":
                case 0:
                    message.pushingStatus = 0;
                    break;
                case "PUSHING_AUDIO":
                case 1:
                    message.pushingStatus = 1;
                    break;
                case "PUSHING_FRONT":
                case 2:
                    message.pushingStatus = 2;
                    break;
                case "PUSHING_BACK":
                case 3:
                    message.pushingStatus = 3;
                    break;
                }
                if (object.sharingScreen != null)
                    message.sharingScreen = Boolean(object.sharingScreen);
                if (object.muteAudio != null)
                    message.muteAudio = Boolean(object.muteAudio);
                if (object.fullscreen != null)
                    message.fullscreen = Boolean(object.fullscreen);
                if (object.whiteBoard != null)
                    message.whiteBoard = Boolean(object.whiteBoard);
                switch (object.deviceType) {
                case "UNKNOWN_DEVICE":
                case 0:
                    message.deviceType = 0;
                    break;
                case "MOBILE_IOS":
                case 1:
                    message.deviceType = 1;
                    break;
                case "MOBILE_ANDROID":
                case 2:
                    message.deviceType = 2;
                    break;
                case "TABLET_IOS":
                case 3:
                    message.deviceType = 3;
                    break;
                case "TABLET_ANDROID":
                case 4:
                    message.deviceType = 4;
                    break;
                case "DESKTOP_WINDOWS":
                case 5:
                    message.deviceType = 5;
                    break;
                case "DESKTOP_MAC":
                case 6:
                    message.deviceType = 6;
                    break;
                case "WEB":
                case 7:
                    message.deviceType = 7;
                    break;
                }
                if (object.group != null)
                    message.group = object.group | 0;
                if (object.medals != null)
                    message.medals = object.medals | 0;
                switch (object.mood) {
                case "ACTIVE":
                case 0:
                    message.mood = 0;
                    break;
                case "HARDWORKING":
                case 1:
                    message.mood = 1;
                    break;
                case "NORMAL":
                case 2:
                    message.mood = 2;
                    break;
                case "WONDERING":
                case 3:
                    message.mood = 3;
                    break;
                }
                return message;
            };
    
            /**
             * Creates a plain object from a UserStatus message. Also converts values to other types if specified.
             * @function toObject
             * @memberof MsgProto.UserStatus
             * @static
             * @param {MsgProto.UserStatus} message UserStatus
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UserStatus.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.id = options.longs === String ? "0" : 0;
                    object.userType = options.enums === String ? "UNKNOWN" : 0;
                    object.online = false;
                    object.handsUp = false;
                    object.pushingStatus = options.enums === String ? "PUSHING_NONE" : 0;
                    object.sharingScreen = false;
                    object.muteAudio = false;
                    object.fullscreen = false;
                    object.whiteBoard = false;
                    object.deviceType = options.enums === String ? "UNKNOWN_DEVICE" : 0;
                    object.group = 0;
                    object.medals = 0;
                    object.mood = options.enums === String ? "ACTIVE" : 0;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    if (typeof message.id === "number")
                        object.id = options.longs === String ? String(message.id) : message.id;
                    else
                        object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber() : message.id;
                if (message.userType != null && message.hasOwnProperty("userType"))
                    object.userType = options.enums === String ? $root.MsgProto.EnumUserType[message.userType] : message.userType;
                if (message.online != null && message.hasOwnProperty("online"))
                    object.online = message.online;
                if (message.handsUp != null && message.hasOwnProperty("handsUp"))
                    object.handsUp = message.handsUp;
                if (message.pushingStatus != null && message.hasOwnProperty("pushingStatus"))
                    object.pushingStatus = options.enums === String ? $root.MsgProto.EnumPushingStatus[message.pushingStatus] : message.pushingStatus;
                if (message.sharingScreen != null && message.hasOwnProperty("sharingScreen"))
                    object.sharingScreen = message.sharingScreen;
                if (message.muteAudio != null && message.hasOwnProperty("muteAudio"))
                    object.muteAudio = message.muteAudio;
                if (message.fullscreen != null && message.hasOwnProperty("fullscreen"))
                    object.fullscreen = message.fullscreen;
                if (message.whiteBoard != null && message.hasOwnProperty("whiteBoard"))
                    object.whiteBoard = message.whiteBoard;
                if (message.deviceType != null && message.hasOwnProperty("deviceType"))
                    object.deviceType = options.enums === String ? $root.MsgProto.EnumDeviceType[message.deviceType] : message.deviceType;
                if (message.group != null && message.hasOwnProperty("group"))
                    object.group = message.group;
                if (message.medals != null && message.hasOwnProperty("medals"))
                    object.medals = message.medals;
                if (message.mood != null && message.hasOwnProperty("mood"))
                    object.mood = options.enums === String ? $root.MsgProto.EnumMood[message.mood] : message.mood;
                return object;
            };
    
            /**
             * Converts this UserStatus to JSON.
             * @function toJSON
             * @memberof MsgProto.UserStatus
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UserStatus.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return UserStatus;
        })();
    
        MsgProto.CombinedInfo = (function() {
    
            /**
             * Properties of a CombinedInfo.
             * @memberof MsgProto
             * @interface ICombinedInfo
             * @property {boolean|null} [audio] CombinedInfo audio
             * @property {boolean|null} [video] CombinedInfo video
             * @property {boolean|null} [whiteBoard] CombinedInfo whiteBoard
             * @property {boolean|null} [fullScreen] CombinedInfo fullScreen
             * @property {MsgProto.EnumCameraType|null} [cameraType] CombinedInfo cameraType
             */
    
            /**
             * Constructs a new CombinedInfo.
             * @memberof MsgProto
             * @classdesc Represents a CombinedInfo.
             * @implements ICombinedInfo
             * @constructor
             * @param {MsgProto.ICombinedInfo=} [properties] Properties to set
             */
            function CombinedInfo(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * CombinedInfo audio.
             * @member {boolean} audio
             * @memberof MsgProto.CombinedInfo
             * @instance
             */
            CombinedInfo.prototype.audio = false;
    
            /**
             * CombinedInfo video.
             * @member {boolean} video
             * @memberof MsgProto.CombinedInfo
             * @instance
             */
            CombinedInfo.prototype.video = false;
    
            /**
             * CombinedInfo whiteBoard.
             * @member {boolean} whiteBoard
             * @memberof MsgProto.CombinedInfo
             * @instance
             */
            CombinedInfo.prototype.whiteBoard = false;
    
            /**
             * CombinedInfo fullScreen.
             * @member {boolean} fullScreen
             * @memberof MsgProto.CombinedInfo
             * @instance
             */
            CombinedInfo.prototype.fullScreen = false;
    
            /**
             * CombinedInfo cameraType.
             * @member {MsgProto.EnumCameraType} cameraType
             * @memberof MsgProto.CombinedInfo
             * @instance
             */
            CombinedInfo.prototype.cameraType = 0;
    
            /**
             * Creates a new CombinedInfo instance using the specified properties.
             * @function create
             * @memberof MsgProto.CombinedInfo
             * @static
             * @param {MsgProto.ICombinedInfo=} [properties] Properties to set
             * @returns {MsgProto.CombinedInfo} CombinedInfo instance
             */
            CombinedInfo.create = function create(properties) {
                return new CombinedInfo(properties);
            };
    
            /**
             * Encodes the specified CombinedInfo message. Does not implicitly {@link MsgProto.CombinedInfo.verify|verify} messages.
             * @function encode
             * @memberof MsgProto.CombinedInfo
             * @static
             * @param {MsgProto.ICombinedInfo} message CombinedInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CombinedInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.audio != null && Object.hasOwnProperty.call(message, "audio"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.audio);
                if (message.video != null && Object.hasOwnProperty.call(message, "video"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.video);
                if (message.whiteBoard != null && Object.hasOwnProperty.call(message, "whiteBoard"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.whiteBoard);
                if (message.fullScreen != null && Object.hasOwnProperty.call(message, "fullScreen"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.fullScreen);
                if (message.cameraType != null && Object.hasOwnProperty.call(message, "cameraType"))
                    writer.uint32(/* id 5, wireType 0 =*/40).int32(message.cameraType);
                return writer;
            };
    
            /**
             * Encodes the specified CombinedInfo message, length delimited. Does not implicitly {@link MsgProto.CombinedInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof MsgProto.CombinedInfo
             * @static
             * @param {MsgProto.ICombinedInfo} message CombinedInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CombinedInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a CombinedInfo message from the specified reader or buffer.
             * @function decode
             * @memberof MsgProto.CombinedInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {MsgProto.CombinedInfo} CombinedInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CombinedInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MsgProto.CombinedInfo();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.audio = reader.bool();
                        break;
                    case 2:
                        message.video = reader.bool();
                        break;
                    case 3:
                        message.whiteBoard = reader.bool();
                        break;
                    case 4:
                        message.fullScreen = reader.bool();
                        break;
                    case 5:
                        message.cameraType = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a CombinedInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof MsgProto.CombinedInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {MsgProto.CombinedInfo} CombinedInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CombinedInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a CombinedInfo message.
             * @function verify
             * @memberof MsgProto.CombinedInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CombinedInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.audio != null && message.hasOwnProperty("audio"))
                    if (typeof message.audio !== "boolean")
                        return "audio: boolean expected";
                if (message.video != null && message.hasOwnProperty("video"))
                    if (typeof message.video !== "boolean")
                        return "video: boolean expected";
                if (message.whiteBoard != null && message.hasOwnProperty("whiteBoard"))
                    if (typeof message.whiteBoard !== "boolean")
                        return "whiteBoard: boolean expected";
                if (message.fullScreen != null && message.hasOwnProperty("fullScreen"))
                    if (typeof message.fullScreen !== "boolean")
                        return "fullScreen: boolean expected";
                if (message.cameraType != null && message.hasOwnProperty("cameraType"))
                    switch (message.cameraType) {
                    default:
                        return "cameraType: enum value expected";
                    case 0:
                    case 1:
                        break;
                    }
                return null;
            };
    
            /**
             * Creates a CombinedInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof MsgProto.CombinedInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {MsgProto.CombinedInfo} CombinedInfo
             */
            CombinedInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.MsgProto.CombinedInfo)
                    return object;
                var message = new $root.MsgProto.CombinedInfo();
                if (object.audio != null)
                    message.audio = Boolean(object.audio);
                if (object.video != null)
                    message.video = Boolean(object.video);
                if (object.whiteBoard != null)
                    message.whiteBoard = Boolean(object.whiteBoard);
                if (object.fullScreen != null)
                    message.fullScreen = Boolean(object.fullScreen);
                switch (object.cameraType) {
                case "FRONT":
                case 0:
                    message.cameraType = 0;
                    break;
                case "BACK":
                case 1:
                    message.cameraType = 1;
                    break;
                }
                return message;
            };
    
            /**
             * Creates a plain object from a CombinedInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof MsgProto.CombinedInfo
             * @static
             * @param {MsgProto.CombinedInfo} message CombinedInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CombinedInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.audio = false;
                    object.video = false;
                    object.whiteBoard = false;
                    object.fullScreen = false;
                    object.cameraType = options.enums === String ? "FRONT" : 0;
                }
                if (message.audio != null && message.hasOwnProperty("audio"))
                    object.audio = message.audio;
                if (message.video != null && message.hasOwnProperty("video"))
                    object.video = message.video;
                if (message.whiteBoard != null && message.hasOwnProperty("whiteBoard"))
                    object.whiteBoard = message.whiteBoard;
                if (message.fullScreen != null && message.hasOwnProperty("fullScreen"))
                    object.fullScreen = message.fullScreen;
                if (message.cameraType != null && message.hasOwnProperty("cameraType"))
                    object.cameraType = options.enums === String ? $root.MsgProto.EnumCameraType[message.cameraType] : message.cameraType;
                return object;
            };
    
            /**
             * Converts this CombinedInfo to JSON.
             * @function toJSON
             * @memberof MsgProto.CombinedInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CombinedInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return CombinedInfo;
        })();
    
        MsgProto.ChatInfo = (function() {
    
            /**
             * Properties of a ChatInfo.
             * @memberof MsgProto
             * @interface IChatInfo
             * @property {Long|null} [id] ChatInfo id
             * @property {string|null} [name] ChatInfo name
             * @property {number|null} [timestamp] ChatInfo timestamp
             * @property {string|null} [content] ChatInfo content
             */
    
            /**
             * Constructs a new ChatInfo.
             * @memberof MsgProto
             * @classdesc Represents a ChatInfo.
             * @implements IChatInfo
             * @constructor
             * @param {MsgProto.IChatInfo=} [properties] Properties to set
             */
            function ChatInfo(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * ChatInfo id.
             * @member {Long} id
             * @memberof MsgProto.ChatInfo
             * @instance
             */
            ChatInfo.prototype.id = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
            /**
             * ChatInfo name.
             * @member {string} name
             * @memberof MsgProto.ChatInfo
             * @instance
             */
            ChatInfo.prototype.name = "";
    
            /**
             * ChatInfo timestamp.
             * @member {number} timestamp
             * @memberof MsgProto.ChatInfo
             * @instance
             */
            ChatInfo.prototype.timestamp = 0;
    
            /**
             * ChatInfo content.
             * @member {string} content
             * @memberof MsgProto.ChatInfo
             * @instance
             */
            ChatInfo.prototype.content = "";
    
            /**
             * Creates a new ChatInfo instance using the specified properties.
             * @function create
             * @memberof MsgProto.ChatInfo
             * @static
             * @param {MsgProto.IChatInfo=} [properties] Properties to set
             * @returns {MsgProto.ChatInfo} ChatInfo instance
             */
            ChatInfo.create = function create(properties) {
                return new ChatInfo(properties);
            };
    
            /**
             * Encodes the specified ChatInfo message. Does not implicitly {@link MsgProto.ChatInfo.verify|verify} messages.
             * @function encode
             * @memberof MsgProto.ChatInfo
             * @static
             * @param {MsgProto.IChatInfo} message ChatInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ChatInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.id);
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.timestamp);
                if (message.content != null && Object.hasOwnProperty.call(message, "content"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.content);
                return writer;
            };
    
            /**
             * Encodes the specified ChatInfo message, length delimited. Does not implicitly {@link MsgProto.ChatInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof MsgProto.ChatInfo
             * @static
             * @param {MsgProto.IChatInfo} message ChatInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ChatInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a ChatInfo message from the specified reader or buffer.
             * @function decode
             * @memberof MsgProto.ChatInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {MsgProto.ChatInfo} ChatInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ChatInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MsgProto.ChatInfo();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.fixed64();
                        break;
                    case 2:
                        message.name = reader.string();
                        break;
                    case 3:
                        message.timestamp = reader.int32();
                        break;
                    case 4:
                        message.content = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a ChatInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof MsgProto.ChatInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {MsgProto.ChatInfo} ChatInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ChatInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a ChatInfo message.
             * @function verify
             * @memberof MsgProto.ChatInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ChatInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                        return "id: integer|Long expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                    if (!$util.isInteger(message.timestamp))
                        return "timestamp: integer expected";
                if (message.content != null && message.hasOwnProperty("content"))
                    if (!$util.isString(message.content))
                        return "content: string expected";
                return null;
            };
    
            /**
             * Creates a ChatInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof MsgProto.ChatInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {MsgProto.ChatInfo} ChatInfo
             */
            ChatInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.MsgProto.ChatInfo)
                    return object;
                var message = new $root.MsgProto.ChatInfo();
                if (object.id != null)
                    if ($util.Long)
                        (message.id = $util.Long.fromValue(object.id)).unsigned = false;
                    else if (typeof object.id === "string")
                        message.id = parseInt(object.id, 10);
                    else if (typeof object.id === "number")
                        message.id = object.id;
                    else if (typeof object.id === "object")
                        message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber();
                if (object.name != null)
                    message.name = String(object.name);
                if (object.timestamp != null)
                    message.timestamp = object.timestamp | 0;
                if (object.content != null)
                    message.content = String(object.content);
                return message;
            };
    
            /**
             * Creates a plain object from a ChatInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof MsgProto.ChatInfo
             * @static
             * @param {MsgProto.ChatInfo} message ChatInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ChatInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.id = options.longs === String ? "0" : 0;
                    object.name = "";
                    object.timestamp = 0;
                    object.content = "";
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    if (typeof message.id === "number")
                        object.id = options.longs === String ? String(message.id) : message.id;
                    else
                        object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber() : message.id;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                    object.timestamp = message.timestamp;
                if (message.content != null && message.hasOwnProperty("content"))
                    object.content = message.content;
                return object;
            };
    
            /**
             * Converts this ChatInfo to JSON.
             * @function toJSON
             * @memberof MsgProto.ChatInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ChatInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return ChatInfo;
        })();
    
        MsgProto.MediaInfo = (function() {
    
            /**
             * Properties of a MediaInfo.
             * @memberof MsgProto
             * @interface IMediaInfo
             * @property {MsgProto.EnumMediaType|null} [type] MediaInfo type
             * @property {string|null} [uri] MediaInfo uri
             * @property {number|null} [position] MediaInfo position
             * @property {boolean|null} [paused] MediaInfo paused
             * @property {boolean|null} [mute] MediaInfo mute
             */
    
            /**
             * Constructs a new MediaInfo.
             * @memberof MsgProto
             * @classdesc Represents a MediaInfo.
             * @implements IMediaInfo
             * @constructor
             * @param {MsgProto.IMediaInfo=} [properties] Properties to set
             */
            function MediaInfo(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * MediaInfo type.
             * @member {MsgProto.EnumMediaType} type
             * @memberof MsgProto.MediaInfo
             * @instance
             */
            MediaInfo.prototype.type = 0;
    
            /**
             * MediaInfo uri.
             * @member {string} uri
             * @memberof MsgProto.MediaInfo
             * @instance
             */
            MediaInfo.prototype.uri = "";
    
            /**
             * MediaInfo position.
             * @member {number} position
             * @memberof MsgProto.MediaInfo
             * @instance
             */
            MediaInfo.prototype.position = 0;
    
            /**
             * MediaInfo paused.
             * @member {boolean} paused
             * @memberof MsgProto.MediaInfo
             * @instance
             */
            MediaInfo.prototype.paused = false;
    
            /**
             * MediaInfo mute.
             * @member {boolean} mute
             * @memberof MsgProto.MediaInfo
             * @instance
             */
            MediaInfo.prototype.mute = false;
    
            /**
             * Creates a new MediaInfo instance using the specified properties.
             * @function create
             * @memberof MsgProto.MediaInfo
             * @static
             * @param {MsgProto.IMediaInfo=} [properties] Properties to set
             * @returns {MsgProto.MediaInfo} MediaInfo instance
             */
            MediaInfo.create = function create(properties) {
                return new MediaInfo(properties);
            };
    
            /**
             * Encodes the specified MediaInfo message. Does not implicitly {@link MsgProto.MediaInfo.verify|verify} messages.
             * @function encode
             * @memberof MsgProto.MediaInfo
             * @static
             * @param {MsgProto.IMediaInfo} message MediaInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MediaInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                if (message.uri != null && Object.hasOwnProperty.call(message, "uri"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.uri);
                if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.position);
                if (message.paused != null && Object.hasOwnProperty.call(message, "paused"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.paused);
                if (message.mute != null && Object.hasOwnProperty.call(message, "mute"))
                    writer.uint32(/* id 5, wireType 0 =*/40).bool(message.mute);
                return writer;
            };
    
            /**
             * Encodes the specified MediaInfo message, length delimited. Does not implicitly {@link MsgProto.MediaInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof MsgProto.MediaInfo
             * @static
             * @param {MsgProto.IMediaInfo} message MediaInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MediaInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a MediaInfo message from the specified reader or buffer.
             * @function decode
             * @memberof MsgProto.MediaInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {MsgProto.MediaInfo} MediaInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MediaInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MsgProto.MediaInfo();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.type = reader.int32();
                        break;
                    case 2:
                        message.uri = reader.string();
                        break;
                    case 3:
                        message.position = reader.int32();
                        break;
                    case 4:
                        message.paused = reader.bool();
                        break;
                    case 5:
                        message.mute = reader.bool();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a MediaInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof MsgProto.MediaInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {MsgProto.MediaInfo} MediaInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MediaInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a MediaInfo message.
             * @function verify
             * @memberof MsgProto.MediaInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MediaInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.type != null && message.hasOwnProperty("type"))
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 0:
                    case 1:
                        break;
                    }
                if (message.uri != null && message.hasOwnProperty("uri"))
                    if (!$util.isString(message.uri))
                        return "uri: string expected";
                if (message.position != null && message.hasOwnProperty("position"))
                    if (!$util.isInteger(message.position))
                        return "position: integer expected";
                if (message.paused != null && message.hasOwnProperty("paused"))
                    if (typeof message.paused !== "boolean")
                        return "paused: boolean expected";
                if (message.mute != null && message.hasOwnProperty("mute"))
                    if (typeof message.mute !== "boolean")
                        return "mute: boolean expected";
                return null;
            };
    
            /**
             * Creates a MediaInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof MsgProto.MediaInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {MsgProto.MediaInfo} MediaInfo
             */
            MediaInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.MsgProto.MediaInfo)
                    return object;
                var message = new $root.MsgProto.MediaInfo();
                switch (object.type) {
                case "AUDIO":
                case 0:
                    message.type = 0;
                    break;
                case "VIDEO":
                case 1:
                    message.type = 1;
                    break;
                }
                if (object.uri != null)
                    message.uri = String(object.uri);
                if (object.position != null)
                    message.position = object.position | 0;
                if (object.paused != null)
                    message.paused = Boolean(object.paused);
                if (object.mute != null)
                    message.mute = Boolean(object.mute);
                return message;
            };
    
            /**
             * Creates a plain object from a MediaInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof MsgProto.MediaInfo
             * @static
             * @param {MsgProto.MediaInfo} message MediaInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MediaInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.type = options.enums === String ? "AUDIO" : 0;
                    object.uri = "";
                    object.position = 0;
                    object.paused = false;
                    object.mute = false;
                }
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.MsgProto.EnumMediaType[message.type] : message.type;
                if (message.uri != null && message.hasOwnProperty("uri"))
                    object.uri = message.uri;
                if (message.position != null && message.hasOwnProperty("position"))
                    object.position = message.position;
                if (message.paused != null && message.hasOwnProperty("paused"))
                    object.paused = message.paused;
                if (message.mute != null && message.hasOwnProperty("mute"))
                    object.mute = message.mute;
                return object;
            };
    
            /**
             * Converts this MediaInfo to JSON.
             * @function toJSON
             * @memberof MsgProto.MediaInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MediaInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return MediaInfo;
        })();
    
        MsgProto.ExerciseSubmit = (function() {
    
            /**
             * Properties of an ExerciseSubmit.
             * @memberof MsgProto
             * @interface IExerciseSubmit
             * @property {Long|null} [id] ExerciseSubmit id
             * @property {Uint8Array|null} [answer] ExerciseSubmit answer
             */
    
            /**
             * Constructs a new ExerciseSubmit.
             * @memberof MsgProto
             * @classdesc Represents an ExerciseSubmit.
             * @implements IExerciseSubmit
             * @constructor
             * @param {MsgProto.IExerciseSubmit=} [properties] Properties to set
             */
            function ExerciseSubmit(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * ExerciseSubmit id.
             * @member {Long} id
             * @memberof MsgProto.ExerciseSubmit
             * @instance
             */
            ExerciseSubmit.prototype.id = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
            /**
             * ExerciseSubmit answer.
             * @member {Uint8Array} answer
             * @memberof MsgProto.ExerciseSubmit
             * @instance
             */
            ExerciseSubmit.prototype.answer = $util.newBuffer([]);
    
            /**
             * Creates a new ExerciseSubmit instance using the specified properties.
             * @function create
             * @memberof MsgProto.ExerciseSubmit
             * @static
             * @param {MsgProto.IExerciseSubmit=} [properties] Properties to set
             * @returns {MsgProto.ExerciseSubmit} ExerciseSubmit instance
             */
            ExerciseSubmit.create = function create(properties) {
                return new ExerciseSubmit(properties);
            };
    
            /**
             * Encodes the specified ExerciseSubmit message. Does not implicitly {@link MsgProto.ExerciseSubmit.verify|verify} messages.
             * @function encode
             * @memberof MsgProto.ExerciseSubmit
             * @static
             * @param {MsgProto.IExerciseSubmit} message ExerciseSubmit message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ExerciseSubmit.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.id);
                if (message.answer != null && Object.hasOwnProperty.call(message, "answer"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.answer);
                return writer;
            };
    
            /**
             * Encodes the specified ExerciseSubmit message, length delimited. Does not implicitly {@link MsgProto.ExerciseSubmit.verify|verify} messages.
             * @function encodeDelimited
             * @memberof MsgProto.ExerciseSubmit
             * @static
             * @param {MsgProto.IExerciseSubmit} message ExerciseSubmit message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ExerciseSubmit.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an ExerciseSubmit message from the specified reader or buffer.
             * @function decode
             * @memberof MsgProto.ExerciseSubmit
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {MsgProto.ExerciseSubmit} ExerciseSubmit
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ExerciseSubmit.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MsgProto.ExerciseSubmit();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.id = reader.fixed64();
                        break;
                    case 2:
                        message.answer = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an ExerciseSubmit message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof MsgProto.ExerciseSubmit
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {MsgProto.ExerciseSubmit} ExerciseSubmit
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ExerciseSubmit.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an ExerciseSubmit message.
             * @function verify
             * @memberof MsgProto.ExerciseSubmit
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ExerciseSubmit.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                        return "id: integer|Long expected";
                if (message.answer != null && message.hasOwnProperty("answer"))
                    if (!(message.answer && typeof message.answer.length === "number" || $util.isString(message.answer)))
                        return "answer: buffer expected";
                return null;
            };
    
            /**
             * Creates an ExerciseSubmit message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof MsgProto.ExerciseSubmit
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {MsgProto.ExerciseSubmit} ExerciseSubmit
             */
            ExerciseSubmit.fromObject = function fromObject(object) {
                if (object instanceof $root.MsgProto.ExerciseSubmit)
                    return object;
                var message = new $root.MsgProto.ExerciseSubmit();
                if (object.id != null)
                    if ($util.Long)
                        (message.id = $util.Long.fromValue(object.id)).unsigned = false;
                    else if (typeof object.id === "string")
                        message.id = parseInt(object.id, 10);
                    else if (typeof object.id === "number")
                        message.id = object.id;
                    else if (typeof object.id === "object")
                        message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber();
                if (object.answer != null)
                    if (typeof object.answer === "string")
                        $util.base64.decode(object.answer, message.answer = $util.newBuffer($util.base64.length(object.answer)), 0);
                    else if (object.answer.length)
                        message.answer = object.answer;
                return message;
            };
    
            /**
             * Creates a plain object from an ExerciseSubmit message. Also converts values to other types if specified.
             * @function toObject
             * @memberof MsgProto.ExerciseSubmit
             * @static
             * @param {MsgProto.ExerciseSubmit} message ExerciseSubmit
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ExerciseSubmit.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.id = options.longs === String ? "0" : 0;
                    if (options.bytes === String)
                        object.answer = "";
                    else {
                        object.answer = [];
                        if (options.bytes !== Array)
                            object.answer = $util.newBuffer(object.answer);
                    }
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    if (typeof message.id === "number")
                        object.id = options.longs === String ? String(message.id) : message.id;
                    else
                        object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber() : message.id;
                if (message.answer != null && message.hasOwnProperty("answer"))
                    object.answer = options.bytes === String ? $util.base64.encode(message.answer, 0, message.answer.length) : options.bytes === Array ? Array.prototype.slice.call(message.answer) : message.answer;
                return object;
            };
    
            /**
             * Converts this ExerciseSubmit to JSON.
             * @function toJSON
             * @memberof MsgProto.ExerciseSubmit
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ExerciseSubmit.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return ExerciseSubmit;
        })();
    
        MsgProto.ExerciseInfo = (function() {
    
            /**
             * Properties of an ExerciseInfo.
             * @memberof MsgProto
             * @interface IExerciseInfo
             * @property {number|null} [choiceCount] ExerciseInfo choiceCount
             * @property {Uint8Array|null} [answer] ExerciseInfo answer
             */
    
            /**
             * Constructs a new ExerciseInfo.
             * @memberof MsgProto
             * @classdesc Represents an ExerciseInfo.
             * @implements IExerciseInfo
             * @constructor
             * @param {MsgProto.IExerciseInfo=} [properties] Properties to set
             */
            function ExerciseInfo(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * ExerciseInfo choiceCount.
             * @member {number} choiceCount
             * @memberof MsgProto.ExerciseInfo
             * @instance
             */
            ExerciseInfo.prototype.choiceCount = 0;
    
            /**
             * ExerciseInfo answer.
             * @member {Uint8Array} answer
             * @memberof MsgProto.ExerciseInfo
             * @instance
             */
            ExerciseInfo.prototype.answer = $util.newBuffer([]);
    
            /**
             * Creates a new ExerciseInfo instance using the specified properties.
             * @function create
             * @memberof MsgProto.ExerciseInfo
             * @static
             * @param {MsgProto.IExerciseInfo=} [properties] Properties to set
             * @returns {MsgProto.ExerciseInfo} ExerciseInfo instance
             */
            ExerciseInfo.create = function create(properties) {
                return new ExerciseInfo(properties);
            };
    
            /**
             * Encodes the specified ExerciseInfo message. Does not implicitly {@link MsgProto.ExerciseInfo.verify|verify} messages.
             * @function encode
             * @memberof MsgProto.ExerciseInfo
             * @static
             * @param {MsgProto.IExerciseInfo} message ExerciseInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ExerciseInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.choiceCount != null && Object.hasOwnProperty.call(message, "choiceCount"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.choiceCount);
                if (message.answer != null && Object.hasOwnProperty.call(message, "answer"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.answer);
                return writer;
            };
    
            /**
             * Encodes the specified ExerciseInfo message, length delimited. Does not implicitly {@link MsgProto.ExerciseInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof MsgProto.ExerciseInfo
             * @static
             * @param {MsgProto.IExerciseInfo} message ExerciseInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ExerciseInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes an ExerciseInfo message from the specified reader or buffer.
             * @function decode
             * @memberof MsgProto.ExerciseInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {MsgProto.ExerciseInfo} ExerciseInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ExerciseInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MsgProto.ExerciseInfo();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.choiceCount = reader.int32();
                        break;
                    case 2:
                        message.answer = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes an ExerciseInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof MsgProto.ExerciseInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {MsgProto.ExerciseInfo} ExerciseInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ExerciseInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies an ExerciseInfo message.
             * @function verify
             * @memberof MsgProto.ExerciseInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ExerciseInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.choiceCount != null && message.hasOwnProperty("choiceCount"))
                    if (!$util.isInteger(message.choiceCount))
                        return "choiceCount: integer expected";
                if (message.answer != null && message.hasOwnProperty("answer"))
                    if (!(message.answer && typeof message.answer.length === "number" || $util.isString(message.answer)))
                        return "answer: buffer expected";
                return null;
            };
    
            /**
             * Creates an ExerciseInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof MsgProto.ExerciseInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {MsgProto.ExerciseInfo} ExerciseInfo
             */
            ExerciseInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.MsgProto.ExerciseInfo)
                    return object;
                var message = new $root.MsgProto.ExerciseInfo();
                if (object.choiceCount != null)
                    message.choiceCount = object.choiceCount | 0;
                if (object.answer != null)
                    if (typeof object.answer === "string")
                        $util.base64.decode(object.answer, message.answer = $util.newBuffer($util.base64.length(object.answer)), 0);
                    else if (object.answer.length)
                        message.answer = object.answer;
                return message;
            };
    
            /**
             * Creates a plain object from an ExerciseInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof MsgProto.ExerciseInfo
             * @static
             * @param {MsgProto.ExerciseInfo} message ExerciseInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ExerciseInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.choiceCount = 0;
                    if (options.bytes === String)
                        object.answer = "";
                    else {
                        object.answer = [];
                        if (options.bytes !== Array)
                            object.answer = $util.newBuffer(object.answer);
                    }
                }
                if (message.choiceCount != null && message.hasOwnProperty("choiceCount"))
                    object.choiceCount = message.choiceCount;
                if (message.answer != null && message.hasOwnProperty("answer"))
                    object.answer = options.bytes === String ? $util.base64.encode(message.answer, 0, message.answer.length) : options.bytes === Array ? Array.prototype.slice.call(message.answer) : message.answer;
                return object;
            };
    
            /**
             * Converts this ExerciseInfo to JSON.
             * @function toJSON
             * @memberof MsgProto.ExerciseInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ExerciseInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return ExerciseInfo;
        })();
    
        return MsgProto;
    })();

    return $root;
});
