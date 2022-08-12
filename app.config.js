export default ({ config }) => {
    const extraConfig = {
        localDevelopment: true,
        AlchemyApiKey: process.env.AlchemyApiKey,
        MoralisApiKey: process.env.MoralisApiKey,
    };
    if (process.env.APP_ENV === "production") {
        extraConfig.localDevelopment = false;
    }
    return {
        ...config,
        extra: extraConfig,
    };
};
