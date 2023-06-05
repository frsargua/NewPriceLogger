import { NewsCard } from "../../components/BrandNewsPage/NewsCard";
import { useParams } from "react-router-dom";
import { ArticleType, TopicParams } from "../../types/generalTypes";
import React from "react";
import { useEffect } from "react";
import axios from "axios";

export default function BrandNewsPage() {
  const { topic } = useParams<keyof TopicParams>() as TopicParams;
  const [news, setNews] = React.useState<ArticleType[]>([]);

  async function fetchNews() {
    var options = {
      method: "GET",
      url: "https://api.newscatcherapi.com/v2/search",
      params: {
        q: `${topic}`,
        lang: "en",
        sort_by: "relevancy",
        page: "1",
        page_size: "10",
      },
      headers: {
        "x-api-key": "EUr2PGWNd4xfAfwdH1x_K3rIb8aFog_9HhOu2aClLFs",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data.articles);
        setNews(response.data.articles);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  useEffect(() => {
    fetchNews();

    return;
  }, []);

  return (
    <>
      <h1 className="mb-4 text-center">News of {topic}</h1>
      <div className="row">
        {news.map((article, i) => (
          <div className="col-md-4" key={i}>
            <div className="card mb-3">
              <div className="card-body">
                <NewsCard data={article} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
