import { getDataFromToken } from "@/app/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await getDataFromToken(request);

    console.log("here");
    const data = await getWeatherData("Vilnius");
    console.log(data);

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

async function getWeatherData(city: string) {
  const apiKey = "35f990d3f16be0c5e246ef6741a0e375";
  //   const weatherURL = `api.openweathermap.org/data/2.5/forecast/daily?lat=${54.68}&lon=${25.27}&cnt=16&appid=${apiKey}`;
  console.log("here");
  const weatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=55.930085&lon=25.1119614&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(weatherURL);
    const weatherData = await response.json();
    console.log(weatherData);
    return weatherData;
  } catch (error) {
    // console.log("Error fetching weather data:", error);
    throw error;
  }
}
