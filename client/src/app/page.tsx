export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          나만의 <span className="text-primary-600">이력서</span>를
          <br />
          쉽고 빠르게
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Readyme에서 이력서를 작성하고, 전문가의 피드백을 받아보세요. 더 나은 커리어를 위한 첫
          걸음을 시작하세요.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <a
            href="/register"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition"
          >
            시작하기
          </a>
          <a
            href="/explore"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            둘러보기
          </a>
        </div>
      </div>
    </div>
  );
}
