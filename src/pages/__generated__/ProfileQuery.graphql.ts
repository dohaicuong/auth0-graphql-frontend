/* tslint:disable */
/* eslint-disable */

import { ConcreteRequest } from "relay-runtime";
export type ProfileQueryVariables = {};
export type ProfileQueryResponse = {
    readonly me: {
        readonly name: string | null;
        readonly email: string | null;
        readonly avatar: string | null;
    } | null;
};
export type ProfileQuery = {
    readonly response: ProfileQueryResponse;
    readonly variables: ProfileQueryVariables;
};



/*
query ProfileQuery {
  me {
    name
    email
    avatar
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "me",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "email",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "avatar",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ProfileQuery",
    "selections": (v0/*: any*/),
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ProfileQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "ProfileQuery",
    "operationKind": "query",
    "text": "query ProfileQuery {\n  me {\n    name\n    email\n    avatar\n  }\n}\n"
  }
};
})();
(node as any).hash = '3830e1a47b6d19103c2796ca3243316c';
export default node;
