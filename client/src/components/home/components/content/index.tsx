import "./style.css";

const Content = () => {
  return (
    <section className="content-section">
      <div className="headers-wrapper">
        <h5 className="headers-author">wiktor rudzki</h5>
        <h1 className="header-title">Make student life easier.</h1>
      </div>
      <div className="apps-wrapper">
        <div className="note-wrapper">
          <h3 className="note-title">note</h3>
          <div className="note-text">
            Lorem Ipsum is simply
            dummy
            text of the printing and
            typesetting industry.
            Lorem Ipsum has been the industry's
            standard dummy text ever since the 1500s
          </div>
        </div>
        <div className="todo-wrapper">
          <h3 className="todo-category">frontend</h3>
          <p className="todo-text">
            Lorem Ipsum is simply dummy text of the printing
          </p>
          <button className="todo-btn">pending</button>
          <p className="todo-date">30.10.2022</p>
        </div>
      </div>
    </section>
  );
};

export default Content;
