/**
 * Mock layer initialization for Wandesk UI standalone preview.
 * Installs mock fetch() interceptor and mock WebSocket.
 * Call `initMock()` before rendering the React app.
 */

import { installMockApi } from "./api"
import { installMockWs } from "./ws"

export function initMock() {
  installMockApi()
  installMockWs()
  console.log(
    "[wandesk-ui] Mock data layer initialized — running in standalone preview mode"
  )
}
