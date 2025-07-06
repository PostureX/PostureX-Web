import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header/Header"
import Slider from "@/components/ui/slider"
import UploadCard from "@/components/ui/upload_card"
import PostureInsightsCarousel from "@/components/ui/PostureInsightsCarousel"
import "./Home.css";

export default function HomePage() {

  // Sample insights data
  const insights = [
    {
      severity_level: 0,
      message: "Your feet are not shoulder width apart. They are 20cm smaller than your shoulder width.",
      percentageChange: 15,
      improvement: false
    },
    {
      severity_level: 1,
      message: "Your back is slightly hunched. Your back is slightly hunched. Your back is slightly hunched. Your back is slightly hunched. Your back is slightly hunched. Your back is slightly hunched andf abaias ajosinffak ajksdjklj.",
      percentageChange: 10,
      improvement: false
    },
    {
      severity_level: 2,
      message: "You are sitting for too long.",
      percentageChange: 5,
      improvement: true
    },
    {
      severity_level: 2,
      message: "You are sitting for too long.",
      percentageChange: 5,
      improvement: true
    },
    {
      severity_level: 2,
      message: "You are sitting for too long.",
      percentageChange: 5,
      improvement: true
    },
    {
      severity_level: 2,
      message: "You are sitting for too long.",
      percentageChange: 5,
      improvement: true
    },
    {
      severity_level: 2,
      message: "You are sitting for too long.",
      percentageChange: 5,
      improvement: true
    },
    {
      severity_level: 2,
      message: "You are sitting for too long.",
      percentageChange: 5,
      improvement: true
    },
  ];

  // Uncomment below to fetch data from API
  // const [uploadData, setUploadData] = useState(null);
  // const [insightsData, setInsightsData] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   setLoading(true);
  //   Promise.all([
  //     fetch("/api/upload").then(res => {
  //       if (!res.ok) throw new Error("API error for upload");
  //       return res.json();
  //     }),
  //     fetch("/api/insights").then(res => {
  //       if (!res.ok) throw new Error("API error for insights");
  //       return res.json();
  //     }),
  //   ])
  //     .then(([upload, insights]) => {
  //       setUploadData(upload);
  //       setInsightsData(insights);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setError(err.message);
  //       setLoading(false);
  //     });
  // }, []);

  return (
    <div className="root-container">
      <Header/>
      <div className="mx-10 mt-6">
        <p className="text-[#6F6F6F] text-[20px] mx-8 mb-2">Posture</p>
        <Slider className="mx-8" />
        <p className="text-[#00205B] text-[45px] font-[600] mt-10 mx-8">Posture Insights</p>
        <PostureInsightsCarousel insights={insights} className="mx-8" />
        <hr className="my-8 mx-10"></hr>
        <p className="text-[#00205B] text-[45px] font-[600] mx-10">Uploads</p>
        <div className="upload-box grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-4 mx-10">
          <Card className="bg-gray-200 border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors cursor-pointer lg:w-[40vw] lg:h-[350px] xl:w-[26vw] xl:h-[350px] add-upload-container">
              <CardContent className="p-8 flex flex-col items-center justify-center h-64">
                <div className="w-16 h-16 bg-[#00205B] rounded-full flex items-center justify-center mb-4">
                  <p className="text-white text-[3vw]">+</p>
                </div>
                <h3 className="text-xl font-semibold text-[#00205B]">New Analysis</h3>
              </CardContent>
          </Card>
          {/* Sample Upload Cards */}
          <UploadCard id={1} date="2023-10-01" />
          <UploadCard id={2} date="2023-10-02" />
          <UploadCard id={3} date="2023-10-03" />   
          <UploadCard id={4} date="2023-10-04" />
          <UploadCard id={5} date="2023-10-05" />
        </div>
      </div>
    </div>
  )
};