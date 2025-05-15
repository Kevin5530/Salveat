const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dvubmazgw',
  api_key: '582688767811428',
  api_secret: '-7M-axj_zRa_K0trEENw-f8RB1Y',
});

module.exports = { cloudinary };
