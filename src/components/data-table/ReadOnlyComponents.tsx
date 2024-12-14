
type ReadOnlyComponentsProps = {
  readOnlyProps: ReadOnlyViewProps;
  value: string;
};

const ReadOnlyComponents: React.FC<ReadOnlyComponentsProps> = ({ readOnlyProps, value }) => {

  if ("hidden" in readOnlyProps) {
    return <div />;
  }

  if ("datetime" in readOnlyProps) {
    const dateValue = new Date(value);
    return (
      <div>
        {dateValue.toLocaleString()}
      </div>
    )
  }

  return (
    <div>
      {value}
    </div>
  )

};

export default ReadOnlyComponents;
