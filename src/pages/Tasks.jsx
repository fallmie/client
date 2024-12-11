import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { API_BASE_URL } from '../util';
import { Link } from 'react-router-dom';
import TasksSkeleton from '../_skeletons/TasksSkeleton';
import { useDisclosure } from '@chakra-ui/react';
import Pagination from '../components/pagination';
import DeleteConfirmation from '../components/DeleteConfirmation';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { BsArrowUp } from 'react-icons/bs';  // Импортируем иконку сортировки
import {
    Badge,
    Box,
    Button,
    Flex,
    Heading,
    Select,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from '@chakra-ui/react';

export default function Tasks() {
    const { user } = useUser();
    const [tasks, setTasks] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    const [itemCount, setItemCount] = useState(0);
    const page = parseInt(searchParams.get('page')) || 1;

    const handleOrderBy = (value) => {
        searchParams.set('orderBy', value);
        setSearchParams(searchParams);
    };

    const handleStatusFilter = (e) => {
        const value = e.target.value;
        if (value) {
            searchParams.set('status', value);
        } else {
            searchParams.delete('status');
        }
        setSearchParams(searchParams);
    };

    useEffect(() => {
        const fetchTasks = async () => {
            // Log current search params to verify
            console.log('Current search params:', Object.fromEntries(searchParams));
            
            const query = searchParams.size ? '?' + searchParams.toString() : '';
            const res = await fetch(`${API_BASE_URL}/tasks/user/${user._id}${query}`, {
                credentials: 'include',
            });
            const { tasks, taskCount } = await res.json();
            setTasks(tasks);
            setItemCount(taskCount);
        };
        fetchTasks();
    }, [searchParams]);
    
    if (!tasks) {
        return <TasksSkeleton />; // Вернуть скелетон, если задачи еще не загружены
    }

    return (
        <Box p="5" maxW="3lg" mx="auto">
            <Heading
                as="h1"
                fontSize="3xl"
                fontWeight="semibold"
                textAlign="center"
                my="7"
            >
                Tasks to do
            </Heading>
            <Flex justify="space-between" mb="3">
                <Box w="100px">
                    <Select placeholder="All" onChange={handleStatusFilter}>
                        <option value="open">Open</option>
                        <option value="done">Done</option>
                    </Select>
                </Box>
                <Button colorScheme="green" textTransform="uppercase" fontWeight="semibold">
                    <Link to="/create-task">Create New Task</Link>
                </Button>
            </Flex>
            <TableContainer>
                <Table px="3" border="2px solid" borderColor="gray.100">
                    <Thead backgroundColor="gray.100">
                        <Tr>
                            <Th>
                                <Flex onClick={() => handleOrderBy('name')} cursor="pointer" alignItems="center">
                                    Task {searchParams.get('orderBy') === 'name' && <BsArrowUp />}
                                </Flex>
                            </Th>
                            <Th>
                                <Flex onClick={() => handleOrderBy('priority')} cursor="pointer" alignItems="center">
                                    Priority {searchParams.get('orderBy') === 'priority' && <BsArrowUp />}
                                </Flex>
                            </Th>
                            <Th>
                                <Flex onClick={() => handleOrderBy('status')} cursor="pointer" alignItems="center">
                                    Status {searchParams.get('orderBy') === 'status' && <BsArrowUp />}
                                </Flex>
                            </Th>
                            <Th>
                                <Flex onClick={() => handleOrderBy('due')} cursor="pointer" alignItems="center">
                                    Due Date {searchParams.get('orderBy') === 'due' && <BsArrowUp />}
                                </Flex>
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {tasks.map((task) => (
                            <Tr key={task._id}>
                                <Td>
                                    <Link to={`/tasks/${task._id}`}>{task.name}</Link>
                                </Td>
                                <Td>
                                    <Badge colorScheme={task.priority === 'urgent' ? 'red' : 'gray'}>
                                        {task.priority}
                                    </Badge>
                                </Td>
                                <Td>
                                    <Badge colorScheme={task.status === 'open' ? 'orange' : 'green'}>
                                        {task.status}
                                    </Badge>
                                </Td>
                                <Td>{task.due ? new Date(task.due).toDateString() : ''}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

            {/* Добавляем компонент пагинации здесь */}
            <Pagination itemCount={itemCount} pageSize={4} currentPage={page} />
        </Box>
    );
}
