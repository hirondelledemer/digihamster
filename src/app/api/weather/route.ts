import { getDataFromToken } from "@/app/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await getDataFromToken(request);
    const data = await getWeatherData();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

async function getWeatherData() {
  const weatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=55.930085&lon=25.1119614&appid=${process.env.WEATHER_API_KEY}&units=metric`;
  try {
    const response = await fetch(weatherURL);
    const weatherData = await response.json();
    return weatherData;
  } catch (error) {
    throw error;
  }
}
