const Adbox = ({ width = '', height = '' }) => {
  // const widthStyle = width ? `w-${width}` : 'w-[300px]';
  // const heightStyle = height ? `h-${height}` : 'h-[250px]';
  const widthStyle = width || '300px';
  const heightStyle = height || '250px';
  return (
    <div className="Adbox w-full  flex justify-center items-center">
      {/* <div className={`bg-gray-300 ${widthStyle} ${heightStyle} flex items-center justify-center`}> */}
      <div className="bg-gray-300 flex items-center justify-center" style={{ width: widthStyle, height: heightStyle }}>
        <span className="text-gray-500">Ad Space</span>
      </div>
    </div>
  );
};

export default Adbox;
