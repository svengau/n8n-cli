export type List<T> = {
  data: Array<T>;
  nextCursor: any;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  isPending: boolean;
};

export type Workflow = {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  active: boolean;
  nodes: Array<{
    parameters: {
      topic?: {
        __rl: boolean;
        value: string;
        mode: string;
        cachedResultName: string;
        cachedResultUrl: string;
      };
      fromEmail?: string;
      toEmail?: string;
      subject?: string;
      emailFormat?: string;
      text?: string;
      options?: {
        appendAttribution?: boolean;
      };
      assignments?: {
        assignments: Array<{
          id: string;
          name: string;
          value: string;
          type: string;
        }>;
      };
      operation?: string;
      collection?: string;
      query?: string;
      message?: string;
    };
    id: string;
    name: string;
    type: string;
    typeVersion: number;
    position: Array<number>;
    webhookId?: string;
    credentials?: {
      aws?: {
        id: string;
        name: string;
      };
      mongoDb?: {
        id: string;
        name: string;
      };
      smtp?: {
        id: string;
        name: string;
      };
    };
  }>;
  connections: {
    "AWS SNS Trigger": {
      main: Array<
        Array<{
          node: string;
          type: string;
          index: number;
        }>
      >;
    };
    "Edit Fields": {
      main: Array<
        Array<{
          node: string;
          type: string;
          index: number;
        }>
      >;
    };
    MongoDB1: {
      main: Array<
        Array<{
          node: string;
          type: string;
          index: number;
        }>
      >;
    };
  };
  settings: {
    executionOrder: string;
  };
  staticData: {
    "node:AWS SNS Trigger": {
      webhookId: string;
    };
  };
  meta: {
    templateCredsSetupCompleted: boolean;
  };
  pinData: {};
  versionId: string;
  triggerCount: number;
  tags: Array<{
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
  }>;
};
