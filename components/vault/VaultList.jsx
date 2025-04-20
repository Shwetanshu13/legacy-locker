import VaultCard from "./VaultCard";

export default function VaultList({
  vaults,
  selectedId,
  onView,
  onEdit,
  onDelete,
  onManualTrigger,
}) {
  return (
    <div className="space-y-6">
      {vaults.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No passwords saved yet</p>
      ) : (
        vaults.map((item, index) => (
          <VaultCard
            key={item.id}
            item={item}
            index={index}
            selectedId={selectedId}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onManualTrigger={onManualTrigger}
          />
        ))
      )}
    </div>
  );
}
