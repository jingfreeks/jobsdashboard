import { QuickActions, Cards, Widgets,Reminders,Modals } from "./component";
import {useDashBoardHooks} from './hooks';
const DasboardSelector = () => {
  const hooks=useDashBoardHooks()

  return (
    <>
      {/* Quick Actions */}
      <QuickActions handleAddJob={hooks.handleAddJob} />
      {/* Stat Cards */}
      <Cards />
      {/* Chart and Widgets */}
      <Widgets data={hooks.data} activities={hooks.activities} />
      {/* Tasks/Reminders */}
      <Reminders tasks={hooks.tasks} />
      {/* Add Job Modal */}
      {hooks.showAddJobModal && (
        <Modals
          handleCloseAddJobModal={hooks.handleCloseAddJobModal}
          handleCreateJob={hooks.handleCreateJob}
          isAdding={hooks.isAdding}
          companies={hooks.companies}
          cities={hooks.cities}
          departments={hooks.departments}
        />
      )}
    </>
  );
};
export default DasboardSelector;
