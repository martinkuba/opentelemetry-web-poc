/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Context } from '@opentelemetry/api';
import {
  SpanProcessor,
  Span,
  ReadableSpan,
} from '@opentelemetry/sdk-trace-base';
import { SessionManager } from './types/SessionManager';

/**
 * BaggageSpanProcessor is a {@link SpanProcessor} that reads entries stored in {@link Baggage}
 */
export class SessionSpanProcessor implements SpanProcessor {
  private _sessionManager: SessionManager;

  constructor(sessionManager: SessionManager) {
    this._sessionManager = sessionManager;
  }

  /**
   * Forces to export all finished spans
   */
  forceFlush(): Promise<void> {
    // no-op
    return Promise.resolve();
  }

  /**
   * Called when a {@link Span} is started, if the `span.isRecording()`
   * returns true.
   * @param span the Span that just started.
   */
  onStart(span: Span, parentContext: Context): void {
    span.setAttribute('session.id', this._sessionManager.getSessionId());
  }

  /**
   * Called when a {@link ReadableSpan} is ended, if the `span.isRecording()`
   * returns true.
   * @param span the Span that just ended.
   */
  onEnd(_: ReadableSpan): void {
    // no-op
  }

  /**
   * Shuts down the processor. Called when SDK is shut down. This is an
   * opportunity for processor to do any cleanup required.
   */
  shutdown(): Promise<void> {
    // no-op
    return Promise.resolve();
  }
}
