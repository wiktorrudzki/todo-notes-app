import "./style.css";

const Content = () => {
  return (
    <section className="content-section">
      <div className="headers-wrapper">
        <h5 className="headers-author">wiktor rudzki</h5>
        <h1 className="header-title">
          Make student life
          <br />
          easier.
        </h1>
        <p className="headers-text">notes & todos...</p>
      </div>
      <div className="apps-wrapper">
        <div className="note-wrapper-content">
          <h3 className="note-title-content">note</h3>
          <div className="note-text-content">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s
          </div>
        </div>
        <div className="todo-wrapper-content">
          <h3 className="todo-category-content">frontend</h3>
          <p className="todo-text-content">
            Lorem Ipsum is simply dummy text of the printing
          </p>
          <button className="todo-btn-content">pending</button>
          <p className="todo-date-content">30.10.2022</p>
        </div>
      </div>
    </section>
  );
};

export default Content;
