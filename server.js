import express from 'express';
import bodyParser from 'body-parser';
import  jwt  from 'jsonwebtoken';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  const secretKey = 'udacity';

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  app.get( "/filteredimage",authenticateToken, async (req, res) => {
    let image_url = req.query.image_url;
    console.log(image_url)
    try {
      if(!image_url){
        return res.status(422).send("Image URL is required")
      }
      let result = await filterImageFromURL(image_url)
      res.status(200).sendFile(result , ()=>{
        deleteLocalFiles([result])
      });
    } catch (error) {
      res.status(500).send(error);
    }
  } );
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Thực hiện xác thực người dùng ở đây (kiểm tra username và password)
  
    // Ví dụ: kiểm tra tên người dùng và mật khẩu đơn giản
    if (username === 'user' && password === 'password') {
      // Tạo token và trả về cho người dùng
      const token = jwt.sign({ username }, secretKey); // Token hết hạn sau 1 giờ
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  });
  
  // Middleware để kiểm tra token cho các routes bảo vệ
  function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const jwtToken = token.substring(7);
    jwt.verify(jwtToken, secretKey, (err, user) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });
      req.user = user;
      next();
    });
  }
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );