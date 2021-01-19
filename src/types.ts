import { Endpoints } from "@octokit/types";
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

export interface PanvalaUser {
  discord: string;
  id: string;
  grain: string;
  address: string;
  time: string;
}

export interface ActionIdentity {
  action: {
    identity: {
      address: string; //"N\u0000sourcecred\u0000core\u0000IDENTITY\u0000tPCdsEqzToKOaHMjzuMY4w\u0000"
      aliases: [];
      id: string; // "tPCdsEqzToKOaHMjzuMY4w"
      name: string; //"Trach"
      subtype: string; //"USER" | "PROJECT"
    };
    type: string; //"CREATE_IDENTITY"
  };
  ledgerTimestamp: number; //1607965089679
  uuid: string; //"nllRk3VkFDO4wPUemSMgvg"
  version: string; //"1"
}

export interface ActionAlias {
  action: {
    alias: {
      address: string; //"N\u0000sourcecred\u0000discord\u0000MEMBER\u0000user\u000094400988516995072\u0000";
      description: string; //"discord/Trach#0842"
    };
    identityId: string; //"tPCdsEqzToKOaHMjzuMY4w"
    type: string; //"ADD_ALIAS"
  };
  ledgerTimestamp: number; //1607965089679
  uuid: string; //"uoyca75i7IMeaHwjjml2Ww"
  version: string; //"1"
}

export interface Receipt {
  amount: string; // "347884681285057728";
  id: string; //"tPCdsEqzToKOaHMjzuMY4w"
}

export interface Distribution {
  id: string; //"Zj0IW04OpVFWfKdpZxYrtQ"
  policy: {
    budget: string; // "2500000000000000000000"
    policyType: string; //"IMMEDIATE"
  };
  receipts: Receipt[];
}

export interface ActionDistribution {
  action: {
    distribution: {
      allocations: Distribution[];
      credTimestamp: number; // 1607817600000
      id: string; //"g5VfLfe8riafxIasJLNHvg"
    };
    type: string; //"DISTRIBUTE_GRAIN"
  };
  ledgerTimestamp: number; // 1607979812883
  uuid: string; // "bSPLDEka9GI9BIPidyn6qQ"
  version: string; //"1"
}

export type ContentResponse = Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["response"];
