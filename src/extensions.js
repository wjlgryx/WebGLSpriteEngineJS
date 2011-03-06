Math.deg = function(radians)
{
   degrees = 360 * radians/(2 * Math.PI);
   return degrees;
}

Math.rad = function(degrees)
{
   radians = (2 * Math.PI * degrees)/360;
   return radians;
}
