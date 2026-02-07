import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import {
  TokenCredentialAuthenticationProvider,
} from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js";

let graphClient: Client | null = null;

function getGraphClient(): Client {
  if (graphClient) return graphClient;

  const credential = new ClientSecretCredential(
    process.env.AZURE_TENANT_ID!,
    process.env.AZURE_CLIENT_ID!,
    process.env.AZURE_CLIENT_SECRET!
  );

  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ["https://graph.microsoft.com/.default"],
  });

  graphClient = Client.initWithMiddleware({ authProvider });
  return graphClient;
}

const siteId = () => process.env.SHAREPOINT_SITE_ID!;

/**
 * Get all items from a SharePoint list with optional filter
 */
export async function getListItems(
  listId: string,
  filter?: string,
  select?: string[]
): Promise<Record<string, unknown>[]> {
  const client = getGraphClient();
  let url = `/sites/${siteId()}/lists/${listId}/items?$expand=fields`;

  if (filter) {
    url += `&$filter=${filter}`;
  }
  if (select && select.length > 0) {
    url += `&$select=${select.join(",")}`;
  }

  const items: Record<string, unknown>[] = [];
  let response = await client.api(url).top(100).get();

  while (response) {
    if (response.value) {
      for (const item of response.value) {
        items.push({
          id: item.id,
          ...((item.fields as Record<string, unknown>) || {}),
        });
      }
    }

    if (response["@odata.nextLink"]) {
      response = await client.api(response["@odata.nextLink"]).get();
    } else {
      break;
    }
  }

  return items;
}

/**
 * Get a single list item by ID
 */
export async function getListItem(
  listId: string,
  itemId: string
): Promise<Record<string, unknown>> {
  const client = getGraphClient();
  const response = await client
    .api(`/sites/${siteId()}/lists/${listId}/items/${itemId}?$expand=fields`)
    .get();

  return {
    id: response.id,
    ...((response.fields as Record<string, unknown>) || {}),
  };
}

/**
 * Update a list item's fields
 */
export async function updateListItem(
  listId: string,
  itemId: string,
  fields: Record<string, unknown>
): Promise<void> {
  const client = getGraphClient();
  await client
    .api(`/sites/${siteId()}/lists/${listId}/items/${itemId}/fields`)
    .patch(fields);
}

/**
 * Create a new list item
 */
export async function createListItem(
  listId: string,
  fields: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const client = getGraphClient();
  const response = await client
    .api(`/sites/${siteId()}/lists/${listId}/items`)
    .post({ fields });

  return {
    id: response.id,
    ...((response.fields as Record<string, unknown>) || {}),
  };
}

/**
 * Find family record by parent email
 */
export async function findFamilyByEmail(
  email: string
): Promise<Record<string, unknown> | null> {
  const listId = process.env.FAMILY_LIST_ID!;
  const normalizedEmail = email.toLowerCase().trim();

  // SharePoint filter doesn't support case-insensitive for single-line text
  // We fetch and filter in memory for reliability
  const items = await getListItems(listId);

  const match = items.find((item) => {
    const p1Email = ((item.f_p1_email as string) || "").toLowerCase().trim();
    const p2Email = ((item.field_16 as string) || "").toLowerCase().trim();
    return p1Email === normalizedEmail || p2Email === normalizedEmail;
  });

  return match || null;
}

/**
 * Get students linked to a family ID.
 * Fetches all students and filters in memory because the lookup field
 * is not indexed in SharePoint and Graph API rejects the $filter.
 */
export async function getStudentsByFamilyId(
  familyId: string
): Promise<Record<string, unknown>[]> {
  const listId = process.env.STUDENTS_LIST_ID!;
  const items = await getListItems(listId);
  return items.filter((item) => String(item.s_f_IDLookupId) === familyId);
}
