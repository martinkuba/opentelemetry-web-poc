const { PageViewEventInstrumentation } = require('@opentelemetry/instrumentation-page-view');
// const { XMLHttpRequestInstrumentation } = require('@opentelemetry/instrumentation-xml-http-request');
const { events } = require('@opentelemetry/api-events');
const { trace } = require('@opentelemetry/api');
const { EventLoggerProvider } = require('@opentelemetry/sdk-events');
const {
  LoggerProvider,
  SimpleLogRecordProcessor,
  ConsoleLogRecordExporter,
} = require('@opentelemetry/sdk-logs');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { WebTracerProvider } = require('@opentelemetry/sdk-trace-web');
const { ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const {
  SessionSpanProcessor,
  SessionLogRecordProcessor,
  SessionStorageSessionManager
} = require('@opentelemetry/web-common');

const sessionManager = new SessionStorageSessionManager();

// configure global TracerProvider
const tracerProvider = new WebTracerProvider();
tracerProvider.addSpanProcessor(
  new SimpleSpanProcessor(new ConsoleSpanExporter())
);
tracerProvider.addSpanProcessor(new SessionSpanProcessor(sessionManager));
trace.setGlobalTracerProvider(tracerProvider);

// configure global EventLoggerProvider
const loggerProvider = new LoggerProvider();
loggerProvider.addLogRecordProcessor(
  new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
);
loggerProvider.addLogRecordProcessor(new SessionLogRecordProcessor(sessionManager));
const eventLoggerProvider = new EventLoggerProvider(loggerProvider);
events.setGlobalEventLoggerProvider(eventLoggerProvider);

registerInstrumentations({
  instrumentations: [
    new PageViewEventInstrumentation(),
    // new XMLHttpRequestInstrumentation(),
  ],
});
