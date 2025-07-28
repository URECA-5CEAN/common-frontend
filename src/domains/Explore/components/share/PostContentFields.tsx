interface PostContentFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
}

const PostContentFields = ({
  title,
  setTitle,
  content,
  setContent,
}: PostContentFieldsProps) => {
  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        <span className="font-bold">제목</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="flex-1 border p-4 rounded-2xl border-gray-200 focus:outline-hidden"
        />
      </div>
      <div className="mb-4">
        <div className="text-right text-sm text-gray-500">
          {content.length}/500
        </div>
        <div className="flex gap-4">
          <span className="pt-4 font-bold">내용</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            maxLength={500}
            rows={6}
            className="flex-1 border p-4 rounded resize-none border-gray-200 focus:outline-hidden"
          />
        </div>
      </div>
    </>
  );
};

export default PostContentFields;
