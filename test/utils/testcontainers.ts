/**
 * Testcontainers utilities for programmatic test environment management
 * Provides type-safe container management with automatic cleanup
 */

import {
  GenericContainer,
  type StartedTestContainer,
  Wait,
} from 'testcontainers';

export interface TestContainerConfig {
  image: string;
  ports: number[];
  env?: Record<string, string>;
  waitStrategy?: 'log' | 'healthcheck' | 'port';
  waitMessage?: string;
  name?: string;
}

export class TestEnvironment {
  private containers: Map<string, StartedTestContainer> = new Map();
  private static instance: TestEnvironment | null = null;

  private constructor() {}

  static getInstance(): TestEnvironment {
    if (!TestEnvironment.instance) {
      TestEnvironment.instance = new TestEnvironment();
    }
    return TestEnvironment.instance;
  }

  /**
   * Start a PostgreSQL container for testing
   */
  async startPostgres(
    database: string = 'test_db',
    username: string = 'test_user',
    password: string = 'test_pass'
  ): Promise<StartedTestContainer> {
    const container = await new GenericContainer('postgres:16-alpine')
      .withEnvironment({
        POSTGRES_DB: database,
        POSTGRES_USER: username,
        POSTGRES_PASSWORD: password,
      })
      .withExposedPorts(5432)
      .withWaitStrategy(Wait.forLogMessage(/.*database system is ready to accept connections.*/))
      .start();

    this.containers.set('postgres', container);
    return container;
  }

  /**
   * Start a Redis container for testing
   */
  async startRedis(password?: string): Promise<StartedTestContainer> {
    const container = await new GenericContainer('redis:7-alpine')
      .withExposedPorts(6379)
      .withCommand(
        password
          ? ['redis-server', '--requirepass', password]
          : ['redis-server']
      )
      .withWaitStrategy(Wait.forLogMessage(/.*Ready to accept connections.*/))
      .start();

    this.containers.set('redis', container);
    return container;
  }

  /**
   * Start a MongoDB container for testing
   */
  async startMongoDB(
    database: string = 'test_db',
    username: string = 'test_user',
    password: string = 'test_pass'
  ): Promise<StartedTestContainer> {
    const container = await new GenericContainer('mongo:7-jammy')
      .withEnvironment({
        MONGO_INITDB_ROOT_USERNAME: username,
        MONGO_INITDB_ROOT_PASSWORD: password,
        MONGO_INITDB_DATABASE: database,
      })
      .withExposedPorts(27017)
      .withWaitStrategy(Wait.forLogMessage(/.*Waiting for connections.*/))
      .start();

    this.containers.set('mongodb', container);
    return container;
  }

  /**
   * Start LocalStack for AWS service mocking
   */
  async startLocalStack(
    services: string[] = ['s3', 'sqs', 'dynamodb']
  ): Promise<StartedTestContainer> {
    const container = await new GenericContainer('localstack/localstack:latest')
      .withEnvironment({
        SERVICES: services.join(','),
        DEBUG: '1',
        AWS_DEFAULT_REGION: 'us-east-1',
        AWS_ACCESS_KEY_ID: 'test',
        AWS_SECRET_ACCESS_KEY: 'test',
      })
      .withExposedPorts(4566)
      .withWaitStrategy(Wait.forLogMessage(/.*Ready.*/))
      .start();

    this.containers.set('localstack', container);
    return container;
  }

  /**
   * Start a generic container with custom configuration
   */
  async startContainer(
    name: string,
    config: TestContainerConfig
  ): Promise<StartedTestContainer> {
    let containerBuilder = new GenericContainer(config.image);

    // Add environment variables
    if (config.env) {
      containerBuilder = containerBuilder.withEnvironment(config.env);
    }

    // Expose ports
    for (const port of config.ports) {
      containerBuilder = containerBuilder.withExposedPorts(port);
    }

    // Add wait strategy
    if (config.waitStrategy === 'log' && config.waitMessage) {
      containerBuilder = containerBuilder.withWaitStrategy(
        Wait.forLogMessage(new RegExp(config.waitMessage))
      );
    } else if (config.waitStrategy === 'healthcheck') {
      containerBuilder = containerBuilder.withWaitStrategy(Wait.forHealthCheck());
    }

    const container = await containerBuilder.start();
    this.containers.set(name, container);
    return container;
  }

  /**
   * Get a running container by name
   */
  getContainer(name: string): StartedTestContainer | undefined {
    return this.containers.get(name);
  }

  /**
   * Get connection details for a container
   */
  getConnectionString(name: string, type: 'postgres' | 'redis' | 'mongodb'): string | null {
    const container = this.containers.get(name);
    if (!container) return null;

    const host = container.getHost();
    const port = container.getMappedPort(
      type === 'postgres' ? 5432 : type === 'redis' ? 6379 : 27017
    );

    switch (type) {
      case 'postgres':
        return `postgresql://test_user:test_pass@${host}:${port}/test_db`;
      case 'redis':
        return `redis://:test_pass@${host}:${port}`;
      case 'mongodb':
        return `mongodb://test_user:test_pass@${host}:${port}/test_db`;
      default:
        return null;
    }
  }

  /**
   * Stop a specific container
   */
  async stopContainer(name: string): Promise<void> {
    const container = this.containers.get(name);
    if (container) {
      await container.stop();
      this.containers.delete(name);
    }
  }

  /**
   * Stop all containers and cleanup
   */
  async cleanup(): Promise<void> {
    const stopPromises = Array.from(this.containers.values()).map((container) =>
      container.stop()
    );
    await Promise.all(stopPromises);
    this.containers.clear();
  }

  /**
   * Get the number of running containers
   */
  getRunningCount(): number {
    return this.containers.size;
  }

  /**
   * Check if a container is running
   */
  isRunning(name: string): boolean {
    return this.containers.has(name);
  }
}

/**
 * Get the singleton test environment instance
 */
export function getTestEnvironment(): TestEnvironment {
  return TestEnvironment.getInstance();
}

/**
 * Helper function to wait for a container to be healthy
 */
export async function waitForContainer(
  container: StartedTestContainer,
  timeoutMs: number = 30000
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const { exitCode } = await container.exec(['echo', 'healthy']);
      if (exitCode === 0) return;
    } catch (error) {
      // Container not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Container did not become healthy within ${timeoutMs}ms`);
}
