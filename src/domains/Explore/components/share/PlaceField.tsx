interface PlaceFieldProps {
  place: string;
  setPlace: (place: string) => void;
}

const PlaceField = ({ place, setPlace }: PlaceFieldProps) => {
  return (
    <div className="mb-6">
      <label className="mr-2 font-bold">장소</label>
      <input
        value={place}
        onChange={(e) => setPlace(e.target.value)}
        placeholder="미정"
        className="border p-3 rounded-2xl w-60 border-gray-200"
      />
    </div>
  );
};

export default PlaceField;
