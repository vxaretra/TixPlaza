import * as Minio from "minio";

const BUCKET_NAME = "uploads";
const ACCESS_PATH = "/api/s3/uploads/"

const config = useRuntimeConfig();

const minioClient = new Minio.Client({
    endPoint: config.minioEndpoint,
    port: parseInt(config.minioPort),
    useSSL: false,
    accessKey: config.minioAccessKey,
    secretKey: config.minioSecretKey,
});

export { minioClient, BUCKET_NAME, ACCESS_PATH };
