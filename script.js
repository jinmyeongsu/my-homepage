'use strict';
const quotes=['작은 시작이 모여, 나만의 큰 변화를 만듭니다.','완벽한 때를 기다리기보다, 오늘 한 걸음 시작해 보세요.','어제보다 조금 더 배웠다면, 오늘도 충분히 잘한 하루입니다.','천천히 가도 괜찮아요. 나만의 방향을 잃지 않으면 됩니다.'];
let quoteIndex=new Date().getDate()%quotes.length;
function showQuote(){document.getElementById('quote').textContent=quotes[quoteIndex];}
showQuote();
document.getElementById('next-quote').addEventListener('click',()=>{quoteIndex=(quoteIndex+1)%quotes.length;showQuote();});
document.getElementById('date').textContent=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(new Date());
function describe(code){if(code===0)return ['☀️','맑음'];if(code<=2)return ['🌤️','대체로 맑음'];if(code===3)return ['☁️','흐림'];if(code<=48)return ['🌫️','안개'];if(code<=57)return ['🌦️','이슬비'];if(code<=67)return ['🌧️','비'];if(code<=77)return ['❄️','눈'];if(code<=82)return ['🌦️','소나기'];if(code<=86)return ['🌨️','눈 소나기'];return ['⛈️','뇌우'];}
async function loadCity(id,lat,lon){
 const card=document.getElementById(id);card.querySelector('.condition').textContent='날씨를 불러오는 중…';
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),12000);
 try{
 const params=new URLSearchParams({latitude:lat,longitude:lon,current:'temperature_2m,weather_code',daily:'temperature_2m_max,temperature_2m_min',timezone:'Asia/Seoul',forecast_days:'1'});
 const response=await fetch('https://api.open-meteo.com/v1/forecast?'+params,{signal:controller.signal});if(!response.ok)throw new Error('weather');
 const data=await response.json();if(!Number.isFinite(data.current?.temperature_2m)||!Number.isFinite(data.current?.weather_code)||!Number.isFinite(data.daily?.temperature_2m_min?.[0])||!Number.isFinite(data.daily?.temperature_2m_max?.[0]))throw new Error('data');
 const [icon,label]=describe(data.current.weather_code);card.querySelector('.weather-icon').textContent=icon;card.querySelector('.temp').textContent=Math.round(data.current.temperature_2m)+'°';card.querySelector('.condition').textContent=label+' · '+data.current.time.slice(11,16)+' 기준';card.querySelector('.range').textContent='최저 '+Math.round(data.daily.temperature_2m_min[0])+'° / 최고 '+Math.round(data.daily.temperature_2m_max[0])+'°';
 }catch(error){card.querySelector('.temp').textContent='--°';card.querySelector('.condition').textContent='날씨를 불러오지 못했습니다';card.querySelector('.range').textContent='인터넷 연결을 확인하고 새로고침을 눌러주세요.';}finally{clearTimeout(timer);}
}
async function refreshWeather(){const button=document.getElementById('refresh');button.disabled=true;try{await Promise.all([loadCity('seoul','37.5665','126.9780'),loadCity('jeju','33.4996','126.5312')]);}finally{button.disabled=false;}}
document.getElementById('refresh').addEventListener('click',refreshWeather);refreshWeather();