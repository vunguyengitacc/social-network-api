const { celebrator } = require("celebrate");

const celebrateConfig = celebrator({}, { abortEarly: true });

export default celebrateConfig;
