const data = {
  cities: [
    "Buses from Kathmandu", "Buses from Pokhara", "Buses from Chitwan", "Buses from Butwal",
    "Buses from Biratnagar", "Buses from Dharan", "Buses from Janakpur", "Buses from Lumbini",
    "Buses from Birgunj", "Buses from Bhairahawa", "Buses from Nepalgunj", "Buses from Dhangadhi",
    "Buses from Hetauda", "Buses from Itahari", "Buses from Birtamode", "Buses from Damak",
    "Buses from Lahan", "Buses from Rajbiraj", "Buses from Tulsipur", "Buses from Ghorahi"
  ]
};
data.cities.forEach(item => {
  console.log(`/cities/${item.toLowerCase().replace(/\s+/g, "-")}`);
});
