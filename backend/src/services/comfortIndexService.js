const calculateComfortScore = (tempCelsius, humidity, windSpeed) => {
    // Temperature Sub-Score (Max deviation tolerance: 20°C)
    const tempDiff = Math.abs(tempCelsius - 22);
    const tempScore = Math.max(0, 100 - (tempDiff / 20) * 100);

    // Humidity Sub-Score (Max deviation tolerance: 45%)
    const humidityDiff = Math.abs(humidity - 45);
    const humidityScore = Math.max(0, 100 - (humidityDiff / 45) * 100);

    // Wind Speed Sub-Score (Max deviation tolerance: 12 m/s)
    const windDiff = Math.abs(windSpeed - 2.5);
    const windScore = Math.max(0, 100 - (windDiff / 12) * 100);

    // Weighted Aggregate Score
    const totalScore = (tempScore * 0.50) + (humidityScore * 0.30) + (windScore * 0.20);

    // Ensure output is an integer strictly clamped between 0 and 100
    return Math.round(Math.min(100, Math.max(0, totalScore)));
};

module.exports = {
    calculateComfortScore
};