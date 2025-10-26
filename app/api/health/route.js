import { NextResponse } from "@node_modules/next/server";

export async function GET() {
  try {
    return NextResponse.json({ message: "API WORKING FINE!!!" }, { status: 200 })
  } catch (error) {
    console.log('Error while health check up!', error);
    return NextResponse.json({ msg: "Internal Server Error!" }, { status: 500 });
  }
}