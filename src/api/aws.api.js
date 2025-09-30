import api from "./index";
import { API_PATHS } from "../config/api";

// Create integration
export const connectAWSApi = (payload) =>
  api.post(API_PATHS.aws.connect, payload);

// List integrations (tenantId defaults to "default")
export const listAWSApi = () => api.get(API_PATHS.aws.list());

// Get integration status
export const statusAWSApi = (id) =>
  api.get(API_PATHS.aws.integrationStatus(id));

// Delete integration
export const deleteAWSApi = (id) =>
  api.delete(API_PATHS.aws.delete(id));

// Get CF Launch Stack link (normalize response)
export const getAWSBootstrapLinkApi = async (saasAccountId, saasRoleName) => {
  const { data } = await api.get(
    API_PATHS.aws.bootstrapLink(saasAccountId, saasRoleName)
  );
  return data?.launchUrl ? data.launchUrl : null;
};

// Get raw CF template YAML
export const getAWSBootstrapTemplateApi = () =>
  api.get(API_PATHS.aws.bootstrapTemplate, { responseType: "text" });

// Poll bootstrap stack status
export const getAWSBootstrapStatusApi = (id) =>
  api.get(API_PATHS.aws.bootstrapStatus(id));
