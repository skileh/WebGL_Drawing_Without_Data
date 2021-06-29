function main() {
  var lastTime;
  var lastFreq;

  const {
    gl,
    meshProgramInfo
  } = initializeWorld();

  // setup GLSL program
  const program = webglUtils.createProgramFromSources(gl, [vs, fs]);
  const vertexIdLoc = gl.getAttribLocation(program, 'vertexId');
  const numVertsLoc = gl.getUniformLocation(program, 'numVerts');
  const freqLoc = gl.getUniformLocation(program, 'freq');
  const timeLoc = gl.getUniformLocation(program, 'time');

  // lookup uniforms
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");


  // Create a texture to render to
  const targetTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, targetTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  var numVerts = 15500; // maximo de vertices
  
  loadGUI(); // carrega a gui

  //movimentos do mouse 
  let mouseX = -1;
  let mouseY = -1;


  function setFramebufferAttachmentSizes(width, height) {
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);
    // define size and format of level 0
    const level = 0;
    const internalFormat = gl.RGBA;
    const border = 0;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;
    const data = null;
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
      width, height, border,
      format, type, data);

    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
  }

  // create a depth renderbuffer
  const depthBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);

  config.objetos = numVerts;

  var fieldOfViewRadians = degToRad(60);

  // draw
  function render(time) {
    if (!pauseObj) {
      time *= 0.0001;// convert to seconds
      lastTime = time;
      lastFreq=freq;
    } else {
      time =lastTime; 
    }

    numVerts=config.objetos;
    const vertexIds = new Float32Array(config.objetos);
    vertexIds.forEach((v, i) => {
      vertexIds[i] = i;
    });

    const idBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, idBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexIds, gl.STATIC_DRAW);

    //verifica se a tela foi redimencionada, se for, seta os novo valores
    if (webglUtils.resizeCanvasToDisplaySize(gl.canvas)) {
      setFramebufferAttachmentSizes(gl.canvas.width, gl.canvas.height);
    }

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    //limpa o canvas 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0, 0, 0, 1);

    // // ------ capta os valores do mouse x e y

    const pixelX = mouseX * gl.canvas.width / gl.canvas.clientWidth;
    const pixelY = gl.canvas.height - mouseY * gl.canvas.height / gl.canvas.clientHeight - 1;

    gl.useProgram(program);

    {
      // Turn on the attribute
      gl.enableVertexAttribArray(vertexIdLoc);

      // Bind the id buffer.
      gl.bindBuffer(gl.ARRAY_BUFFER, idBuffer);

      // Tell the attribute how to get data out of idBuffer (ARRAY_BUFFER)
      const size = 1; // 1 components per iteration
      const type = gl.FLOAT; // the data is 32bit floats
      const normalize = false; // don't normalize the data
      const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
      const offset = 0; // start at the beginning of the buffer
      gl.vertexAttribPointer(
        vertexIdLoc, size, type, normalize, stride, offset);
    }



    // Compute the projection matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var zNear = 1;
    var zFar = 2500;
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

    // Compute a matrix for the camera
    var cameraMatrix = m4.translation((pixelX / gl.canvas.clientWidth - 0.5) * .1, (pixelY / gl.canvas.clientHeight - 0.5) * .1, 2);
    var viewMatrix = m4.inverse(cameraMatrix);
    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);


    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, viewProjectionMatrix);




    // tell the shader the number of verts
    gl.uniform1f(numVertsLoc, numVerts);
    // tell the shader the time
    gl.uniform1f(timeLoc, time);
    gl.uniform1f(freqLoc, parseFloat(lastFreq));
    const offset = 0;
    gl.drawArrays(gl.POINTS, offset, numVerts);


    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  gl.canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
}

main();