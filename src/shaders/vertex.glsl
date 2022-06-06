varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vView;

void main()
{
    vec4 transformed=modelViewMatrix*vec4(position,1.);
    
    vView=normalize(-transformed.xyz);
    
    vNormal=normal;
    vPosition=position;
    // vec4 mvPosition=modelViewMatrix*vec4(position,1.);
    // gl_PointSize=100.*(1./-mvPosition.z);
    
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
    
    vUv=uv;
}