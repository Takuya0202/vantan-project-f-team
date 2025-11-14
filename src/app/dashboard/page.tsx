import { Card } from "../components/dashboard/card";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import InsightsIcon from "@mui/icons-material/Insights";
import Footer from "../components/footer";
import Logout from "../feature/auth/logout";

export default function Dashboard() {
  return (
    <div className="h-full  px-2 ">
      <div className=" flex flex-col items-center justify-between gap-11 mt-[62px]">
        <Card
          name="今日の走行距離"
          className=""
          distance={10.7}
          divClassName=""
          icon={<TwoWheelerIcon className="text-[95px] mr-7 " />}
        />
        <Card
          name="一週間の走行距離"
          className=""
          distance={108.7}
          icon={<InsightsIcon className="text-[95px] mr-7 " />}
        />
        <Card
          name="今までの走行距離"
          className=""
          distance={108.7}
          icon={<InsightsIcon className="text-[95px] mr-7 " />}
        />
      </div>
      <Logout />
      <Footer />
    </div>
  );
}