import { getDashboardMock } from "@innate/scene-mocks"

export const runtime = "nodejs"

export async function GET() {
  return Response.json(getDashboardMock())
}
