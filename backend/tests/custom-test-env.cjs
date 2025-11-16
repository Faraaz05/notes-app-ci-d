import { default as NodeEnvironment } from 'jest-environment-node';

/**
 * Custom Jest environment to fix localStorage issue in Node.js 22+
 */
class CustomTestEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    
    // Disable localStorage initialization in Node environment
    this.global.localStorage = undefined;
  }

  async setup() {
    await super.setup();
  }

  async teardown() {
    await super.teardown();
  }
}

export default CustomTestEnvironment;
