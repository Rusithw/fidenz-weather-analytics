/**
 * Calculates a Comfort Index Score ranging from 0 to 100.
 *
 * Parameters used:
 * 1. Temperature (°C) - Ideal: 22°C (Weight: 50%)
 * 2. Humidity (%)      - Ideal: 45% (Weight: 30%)
 * 3. Wind Speed (m/s)  - Ideal: 2.5 m/s (Weight: 20%)
 *
 * @param {number} temperature - Temperature in Celsius
 * @param {number} humidity - Humidity percentage (0 - 100)
 * @param {number} windSpeed - Wind speed in meters per second
 * @returns {number} Score strictly bounded between 0 and 100
 */

const calculateComfortScore = (temperature, humidity, windSpeed) => {
    // Calculate Temperature Sub-score
    // Baseline is 22°C. Deduct 5 points for each 1°C deviation from 22°C.
    const tempDiff = Math.abs(temperature - 22);
    let tempScore = 100 - (tempDiff * 5);

    // Calculate Humidity Sub-score
    // Baseline is 45%. Deduct 2 points for each 1% deviation from 45%.
    const humidityDiff = Math.abs(humidity - 45);
    let humidityScore = 100 - (humidityDiff * 2);

    // Calculate Wind Speed Sub-score
    // Baseline is 2.5 m/s. Deduct 10 points for each 1 m/s deviation from 2.5 m/s.
    const windDiff = Math.abs(windSpeed - 2.5);
    let windScore = 100 - (windDiff * 10);

    // Clamp each individual sub-score to a minimum of 0 (avoid negative numbers)
    tempScore = Math.max(0, tempScore);
    humidityScore = Math.max(0, humidityScore);
    windScore = Math.max(0, windScore);

    // Calculate final weighted average (50% Temp, 30% Humidity, 20% Wind)
    const finalScore = (tempScore * 0.5) + (humidityScore * 0.3) + (windScore * 0.2);

    // Return final score as an integer strictly between 0 and 100
    return Math.round(Math.min(100, Math.max(0, finalScore)));
};

module.exports = {
    calculateComfortScore
};