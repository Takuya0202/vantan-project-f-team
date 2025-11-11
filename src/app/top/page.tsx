import Geo from "../feature/geocoding";
import NavigationMap from "../feature/navigation-map";

export default function Index() {
  return (
    <div className="flex flex-col h-screen">
      {/* 入力エリア */}
      <div className="my-3 fixed top-10 z-50 left-1/2 -translate-1/2">
        <Geo position="from" />
        <Geo position="to" />
      </div>
      
      {/* マップエリア */}
      <div className="flex-1">
        <NavigationMap />
      </div>
    </div>
  );
}