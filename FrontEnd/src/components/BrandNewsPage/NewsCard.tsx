import Rating from "react-rating";
import { FaStar, FaRegStar } from "react-icons/fa";

type ArticleType = {
  topic?: string;
  media?: string;
  published_date?: Date;
  title?: string;
  summary?: string;
  link?: string;
};

type PropsType = {
  data: ArticleType;
};

export function NewsCard({ data }: PropsType) {
  return (
    <>
      <div className="card h-100">
        <a
          href={data.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ height: "70%" }}
        >
          <img
            className="card-img-top"
            src={data.media}
            alt="News Thumbnail"
            style={{ objectFit: "cover", height: "100%" }}
          />
        </a>
        <div className="card-body">
          <h5 className="card-title font-weight-bold text-truncate mb-1">
            {data.title}
          </h5>
          <p className="card-text text-truncate">{data.summary}</p>
          <p className="card-text">
            Published: {data.published_date?.toString()}
          </p>
          <p className="card-text">Author: {data.author}</p>
          <div className="d-flex align-items-center">
            <Rating
              emptySymbol={<FaRegStar color="#ffc107" />}
              fullSymbol={<FaStar color="#ffc107" />}
              initialRating={data._score}
              readonly
            />
            <span className="ml-2">{data._score.toFixed(1)}</span>
          </div>{" "}
        </div>
      </div>
    </>
  );
}
