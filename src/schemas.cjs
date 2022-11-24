// @ts-nocheck
"use strict";exports.DidDocument = validate10;const schema11 = {"$id":"https://schemas.blockcore.net/did-server/did-document.json","type":"object","additionalProperties":false,"properties":{"id":{"type":"string","maxLength":100},"controller":{"type":"string"},"service":{"type":"array","minItems":0,"maxItems":10,"items":{"type":"object","properties":{"id":{"type":"string","maxLength":5,"minLength":1},"type":{"type":"string","maxLength":100,"minLength":1},"serviceEndpoint":{"type":"string","maxLength":2000,"minLength":1}}}},"verificationMethod":{"type":"array","minItems":1,"maxItems":10},"authentication":{"type":"array","minItems":1,"maxItems":10},"assertionMethod":{"type":"array","minItems":0,"maxItems":10}}};const func2 = require("ajv/dist/runtime/ucs2length").default;function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){/*# sourceURL="https://schemas.blockcore.net/did-server/did-document.json" */;let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){const _errs1 = errors;for(const key0 in data){if(!((((((key0 === "id") || (key0 === "controller")) || (key0 === "service")) || (key0 === "verificationMethod")) || (key0 === "authentication")) || (key0 === "assertionMethod"))){validate10.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];return false;break;}}if(_errs1 === errors){if(data.id !== undefined){let data0 = data.id;const _errs2 = errors;if(errors === _errs2){if(typeof data0 === "string"){if(func2(data0) > 100){validate10.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"}];return false;}}else {validate10.errors = [{instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.controller !== undefined){const _errs4 = errors;if(typeof data.controller !== "string"){validate10.errors = [{instancePath:instancePath+"/controller",schemaPath:"#/properties/controller/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs4 === errors;}else {var valid0 = true;}if(valid0){if(data.service !== undefined){let data2 = data.service;const _errs6 = errors;if(errors === _errs6){if(Array.isArray(data2)){if(data2.length > 10){validate10.errors = [{instancePath:instancePath+"/service",schemaPath:"#/properties/service/maxItems",keyword:"maxItems",params:{limit: 10},message:"must NOT have more than 10 items"}];return false;}else {if(data2.length < 0){validate10.errors = [{instancePath:instancePath+"/service",schemaPath:"#/properties/service/minItems",keyword:"minItems",params:{limit: 0},message:"must NOT have fewer than 0 items"}];return false;}else {var valid1 = true;const len0 = data2.length;for(let i0=0; i0<len0; i0++){let data3 = data2[i0];const _errs8 = errors;if(errors === _errs8){if(data3 && typeof data3 == "object" && !Array.isArray(data3)){if(data3.id !== undefined){let data4 = data3.id;const _errs10 = errors;if(errors === _errs10){if(typeof data4 === "string"){if(func2(data4) > 5){validate10.errors = [{instancePath:instancePath+"/service/" + i0+"/id",schemaPath:"#/properties/service/items/properties/id/maxLength",keyword:"maxLength",params:{limit: 5},message:"must NOT have more than 5 characters"}];return false;}else {if(func2(data4) < 1){validate10.errors = [{instancePath:instancePath+"/service/" + i0+"/id",schemaPath:"#/properties/service/items/properties/id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];return false;}}}else {validate10.errors = [{instancePath:instancePath+"/service/" + i0+"/id",schemaPath:"#/properties/service/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}var valid2 = _errs10 === errors;}else {var valid2 = true;}if(valid2){if(data3.type !== undefined){let data5 = data3.type;const _errs12 = errors;if(errors === _errs12){if(typeof data5 === "string"){if(func2(data5) > 100){validate10.errors = [{instancePath:instancePath+"/service/" + i0+"/type",schemaPath:"#/properties/service/items/properties/type/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"}];return false;}else {if(func2(data5) < 1){validate10.errors = [{instancePath:instancePath+"/service/" + i0+"/type",schemaPath:"#/properties/service/items/properties/type/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];return false;}}}else {validate10.errors = [{instancePath:instancePath+"/service/" + i0+"/type",schemaPath:"#/properties/service/items/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}var valid2 = _errs12 === errors;}else {var valid2 = true;}if(valid2){if(data3.serviceEndpoint !== undefined){let data6 = data3.serviceEndpoint;const _errs14 = errors;if(errors === _errs14){if(typeof data6 === "string"){if(func2(data6) > 2000){validate10.errors = [{instancePath:instancePath+"/service/" + i0+"/serviceEndpoint",schemaPath:"#/properties/service/items/properties/serviceEndpoint/maxLength",keyword:"maxLength",params:{limit: 2000},message:"must NOT have more than 2000 characters"}];return false;}else {if(func2(data6) < 1){validate10.errors = [{instancePath:instancePath+"/service/" + i0+"/serviceEndpoint",schemaPath:"#/properties/service/items/properties/serviceEndpoint/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];return false;}}}else {validate10.errors = [{instancePath:instancePath+"/service/" + i0+"/serviceEndpoint",schemaPath:"#/properties/service/items/properties/serviceEndpoint/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}var valid2 = _errs14 === errors;}else {var valid2 = true;}}}}else {validate10.errors = [{instancePath:instancePath+"/service/" + i0,schemaPath:"#/properties/service/items/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}var valid1 = _errs8 === errors;if(!valid1){break;}}}}}else {validate10.errors = [{instancePath:instancePath+"/service",schemaPath:"#/properties/service/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid0 = _errs6 === errors;}else {var valid0 = true;}if(valid0){if(data.verificationMethod !== undefined){let data7 = data.verificationMethod;const _errs16 = errors;if(errors === _errs16){if(Array.isArray(data7)){if(data7.length > 10){validate10.errors = [{instancePath:instancePath+"/verificationMethod",schemaPath:"#/properties/verificationMethod/maxItems",keyword:"maxItems",params:{limit: 10},message:"must NOT have more than 10 items"}];return false;}else {if(data7.length < 1){validate10.errors = [{instancePath:instancePath+"/verificationMethod",schemaPath:"#/properties/verificationMethod/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];return false;}}}else {validate10.errors = [{instancePath:instancePath+"/verificationMethod",schemaPath:"#/properties/verificationMethod/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid0 = _errs16 === errors;}else {var valid0 = true;}if(valid0){if(data.authentication !== undefined){let data8 = data.authentication;const _errs18 = errors;if(errors === _errs18){if(Array.isArray(data8)){if(data8.length > 10){validate10.errors = [{instancePath:instancePath+"/authentication",schemaPath:"#/properties/authentication/maxItems",keyword:"maxItems",params:{limit: 10},message:"must NOT have more than 10 items"}];return false;}else {if(data8.length < 1){validate10.errors = [{instancePath:instancePath+"/authentication",schemaPath:"#/properties/authentication/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"}];return false;}}}else {validate10.errors = [{instancePath:instancePath+"/authentication",schemaPath:"#/properties/authentication/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid0 = _errs18 === errors;}else {var valid0 = true;}if(valid0){if(data.assertionMethod !== undefined){let data9 = data.assertionMethod;const _errs20 = errors;if(errors === _errs20){if(Array.isArray(data9)){if(data9.length > 10){validate10.errors = [{instancePath:instancePath+"/assertionMethod",schemaPath:"#/properties/assertionMethod/maxItems",keyword:"maxItems",params:{limit: 10},message:"must NOT have more than 10 items"}];return false;}else {if(data9.length < 0){validate10.errors = [{instancePath:instancePath+"/assertionMethod",schemaPath:"#/properties/assertionMethod/minItems",keyword:"minItems",params:{limit: 0},message:"must NOT have fewer than 0 items"}];return false;}}}else {validate10.errors = [{instancePath:instancePath+"/assertionMethod",schemaPath:"#/properties/assertionMethod/type",keyword:"type",params:{type: "array"},message:"must be array"}];return false;}}var valid0 = _errs20 === errors;}else {var valid0 = true;}}}}}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;}