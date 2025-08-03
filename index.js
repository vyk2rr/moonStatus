const swisseph = require('swisseph');

swisseph.swe_set_ephe_path(__dirname + '/ephe');

const year = 2025, month = 8, day = 2;
const hour = 16, minute = 15, second = 0; // UTC
const lat = 19.3333;
const lon = -103.7667;

swisseph.swe_utc_to_jd(
  year, month, day, hour, minute, second, swisseph.SE_GREG_CAL,
  (jdres) => {
    if (!jdres || jdres.error) {
      console.error('Error en swe_utc_to_jd:', jdres && jdres.error);
      return;
    }
    const julDay = jdres.julianDayUT;

    swisseph.swe_calc_ut(julDay, swisseph.SE_SUN, 0, (sun) => {
      swisseph.swe_calc_ut(julDay, swisseph.SE_MOON, 0, (moon) => {
        // Fase angular Sol-Luna
        let phaseAngle = (moon.longitude - sun.longitude + 360) % 360;
        let illumination = (1 - Math.cos(phaseAngle * Math.PI / 180)) / 2 * 100;

        // Edad lunar
        let moonAge = phaseAngle / 360 * 29.530588853;

        // Distancias (en km)
        let moonDistance = moon.distance; // km
        let sunDistance = sun.distance;   // km

        // Ángulo aparente (en grados)
        let moonAngle = 2 * Math.atan(1737.4 / moonDistance) * (180 / Math.PI);
        let sunAngle = 2 * Math.atan(695700 / sunDistance) * (180 / Math.PI);

        // Fase textual
        let phaseText = '';
        if (phaseAngle < 1) phaseText = 'New Moon';
        else if (phaseAngle < 90) phaseText = 'Waxing Crescent';
        else if (phaseAngle < 91) phaseText = 'First Quarter';
        else if (phaseAngle < 180) phaseText = 'Waxing Gibbous';
        else if (phaseAngle < 181) phaseText = 'Full Moon';
        else if (phaseAngle < 270) phaseText = 'Waning Gibbous';
        else if (phaseAngle < 271) phaseText = 'Last Quarter';
        else phaseText = 'Waning Crescent';

        console.log('Phase:', phaseText);
        console.log('Illumination:', illumination.toFixed(2) + '%');
        console.log('Moon Age:', moonAge.toFixed(2) + ' days');
        console.log('Moon Angle:', moonAngle.toFixed(2));
        console.log('Moon Distance:', moonDistance.toLocaleString() + ' km');
        console.log('Sun Angle:', sunAngle.toFixed(2));
        console.log('Sun Distance:', sunDistance.toLocaleString() + ' km');
      });
    });
  }
);