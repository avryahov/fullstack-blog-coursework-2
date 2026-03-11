import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { API_KEYS } from './constant/api-keys';

const FooterDiv = styled.div({
  display: 'flex',
  position: 'relative',
  justifyContent: 'space-between',
  alignContent: 'center',
  height: '120px',
  padding: '20px 40px',
  backgroundColor: '#eeee',
  boxShadow: '0 -3px 10px -1px black',
  width: '1000px',
  fontWeight: 'bold',
});

export const Footer = () => {
  const [city, setCity] = useState('');
  const [temperature, setTemperature] = useState('');
  const [pressure, setPressure] = useState('');

  useEffect(() => {
    const headers = {
      'X-Yandex-Weather-Key': API_KEYS.WEATHER_API,
    };
    axios
      .get('https://api.weather.yandex.ru/v2/forecast?lat=55.7558648&lon=37.617698&lang=ru_RU', { headers })
      .then(({ data: { fact } }) => {
        setCity('Москва');
        setTemperature(fact.temp);
        setPressure(fact.pressure_mm);
      });
  }, []);

  return (
    <FooterDiv>
      <div>
        <div>Блог веб-разработчика</div>
        <div>web@developer.ru</div>
      </div>
      <div>
        <div>
          {city}, {new Date().toLocaleString('ru', { day: 'numeric', month: 'long' })}
        </div>
        <div>
          {temperature} градусов, {pressure} мм рт ст
        </div>
      </div>
    </FooterDiv>
  );
};
