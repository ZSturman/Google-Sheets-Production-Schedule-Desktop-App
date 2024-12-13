
type ReadOnlyComponentsProps = {
  readOnlyProps: ReadOnlyViewProps;
  value: string;
};

const ReadOnlyComponents: React.FC<ReadOnlyComponentsProps> = ({ readOnlyProps, value }) => {

  if ("hidden" in readOnlyProps) {
    return <div />;
  }

  return (
    <div>
      {value}
    </div>
  )

};

export default ReadOnlyComponents;
