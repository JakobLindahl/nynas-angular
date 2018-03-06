import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UpdatableTable, WeatherData } from '../data';


const WEATHER_URL: string = "http://api.openweathermap.org/data/2.5/forecast?q=Nynashamn&APPID=14e392b947d7270060ce0c117b7c838b&lang=se";


@Injectable()
export class WeatherService {

  constructor(private http: HttpClient) { }

  refresh(table: UpdatableTable) {
    this.http.get(WEATHER_URL).subscribe( data => {
      var weatherResponse = this.parseWeather(data);
      table.updateWeather(weatherResponse);
    });
  }

  parseWeather(data: any): Array<WeatherData> {
    var weatherData = new Array<WeatherData>();
    var weatherList = data.list;

    for(let index = 0; index < 7; index++) {
      var time = weatherList[index].dt_txt;
      time = new Date(time).getHours() + ":00";
      if(time.length < 5) {
        time = "0" + time;
      }

      var wind = weatherList[index].wind.speed.toFixed(1);

      var temp = Number(weatherList[index].main.temp - 273.15).toFixed(1);
    
      var desc = weatherList[index].weather[0].description;
      desc = desc[0].toUpperCase() + desc.substr(1);

      weatherData.push({
        clock: time,
        wind: wind,
        temperature: temp,
        description: desc
      });
    }
    return weatherData;
  }
}
