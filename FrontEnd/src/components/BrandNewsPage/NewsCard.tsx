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
      <div className="col-xs-12 col-md-6 col-lg-4">
        <div className="card mb-3">
          <a href={data.link} target="_blank" rel="noopener noreferrer">
            <img className="card-img-top" src={data.media} alt="Paella dish" />
          </a>
          <div className="card-body">
            <h5 className="card-title font-weight-bold text-truncate mb-1">
              {data.title}
            </h5>
            <p className="card-text text-truncate">{data.summary}</p>
            <p className="card-text">{data.published_date?.toString()}</p>
          </div>
        </div>
      </div>
    </>
  );
}
