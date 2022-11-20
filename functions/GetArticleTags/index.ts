import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { v4 as uuid } from "uuid";

type PredictionResult = {
  jobId: string;
  lastUpdateDateTime: string;
  createdDateTime: string;
  expirationDateTime: string;
  status: string;
  errors: never[];
  displayName: string;
  tasks: {
    completed: number;
    failed: number;
    inProgress: number;
    total: number;
    items: {
      kind: string;
      lastUpdateDateTime: string;
      status: string;
      results: {
        documents: {
          id: string;
          class: never[];
          warnings: never[];
        }[];
        errors: never[];
        projectName: string;
        deploymentName: string;
      };
    }[];
  };
};

const submitForPrediction = (text: string, id: string) =>
  fetch(
    `${process.env["CS_API_URL"]}/language/analyze-text/jobs/?api-version=2022-10-01-preview`,
    {
      body: JSON.stringify({
        tasks: [
          {
            kind: "CustomMultiLabelClassification",
            parameters: {
              projectName: "azurki-article-tagging",
              deploymentName: "azurki-article-tagging1-deploy",
            },
          },
        ],
        displayName: "CustomTextPortal_CustomMultiLabelClassification",
        analysisInput: {
          documents: [
            {
              id: id,
              text: text,
              language: "en-US",
            },
          ],
        },
      }),
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env["OCP_APIM_SUBSCRIPTION_KEY"],
      },
      method: "POST",
    }
  );

const retrievePrediction = (operationLocation: string) =>
  fetch(operationLocation, {
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": process.env["OCP_APIM_SUBSCRIPTION_KEY"],
    },
  });

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  if (req.method === "GET") {
    context.res = {
      status: 200,
      body: "GET request not supported",
    };

    return;
  }

  const documentId = uuid();
  const data = await submitForPrediction(req.body.article, documentId);

  if (data.status !== 202) {
    context.res = {
      status: 500,
      body: "Something went wrong",
    };

    return;
  }

  const operationLocation = data.headers.get("operation-location");

  if (!operationLocation) {
    context.res = {
      status: 500,
      body: "Something went wrong",
    };

    return;
  }

  let predictionData: PredictionResult | null = null;

  const prediction = await retrievePrediction(operationLocation);

  predictionData = await prediction.json();

  while (predictionData.status !== "succeeded") {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const prediction = await retrievePrediction(operationLocation);

    predictionData = await prediction.json();
  }

  context.res = {
    body: {
      class:
        predictionData.tasks.items[0]?.results?.documents[0].class ??
        predictionData,
    },
  };
};

export default httpTrigger;
