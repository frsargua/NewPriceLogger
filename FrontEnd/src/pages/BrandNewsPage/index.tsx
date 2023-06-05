import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ArticleType, TopicParams } from "../../types/generalTypes";
import { NewsCard } from "../../components/BrandNewsPage/NewsCard";

export default function BrandNewsPage() {
  const { topic } = useParams<keyof TopicParams>() as TopicParams;
  const [news, setNews] = useState<ArticleType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  async function fetchNews(page) {
    const options = {
      method: "GET",
      url: "https://api.newscatcherapi.com/v2/search",
      params: {
        q: `${topic}`,
        lang: "en",
        sort_by: "relevancy",
        page: page,
        page_size: "10",
      },
      headers: {
        "x-api-key": "RQNBG6JSvwgi3hBe9FhLGHBTeBSusR1-KY_iehT1_lU",
      },
    };

    try {
      const response = await axios.request(options);

      setNews(response.data.articles);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchNews(currentPage);

    return;
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <>
      <h1 className="mb-4 text-center">News of {topic}</h1>
      <div className="row">
        {news.map((article, i) => (
          <div className="col-xs-12 col-md-6 col-lg-4" key={i}>
            <div className="pb-4 h-100">
              <NewsCard data={article} />
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center mt-4">
        <nav aria-label="News Pagination">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
