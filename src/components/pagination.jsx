import { Button, Flex, Text } from '@chakra-ui/react';
import { 
    BsChevronDoubleLeft, 
    BsChevronDoubleRight, 
    BsChevronLeft, 
    BsChevronRight 
} from 'react-icons/bs';
import { useSearchParams } from 'react-router-dom';

export default function Pagination({ itemCount, pageSize, currentPage }) {
    // Хук для работы с параметрами строки запроса
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Подсчитаем общее количество страниц
    const pageCount = Math.ceil(itemCount / pageSize);
    
    // Если количество страниц <= 1, не отображаем пагинацию
    if (pageCount <= 1) {
        return null;
    }
    
    // Функция для изменения страницы в URL
    const changePage = (page) => {
        searchParams.set('page', page.toString());
        setSearchParams(searchParams);
    };

    return (
        <Flex align="center" gap="2" mt="2">
            {/* Отображаем текущую страницу и общее количество страниц */}
            <Text fontSize="md">
                Page {currentPage} of {pageCount}
            </Text>

            {/* Кнопки навигации между страницами */}
            <Button 
                isDisabled={currentPage === 1} 
                onClick={() => changePage(1)}
            >
                <BsChevronDoubleLeft />
            </Button>

            <Button 
                isDisabled={currentPage === 1} 
                onClick={() => changePage(currentPage - 1)}
            >
                <BsChevronLeft />
            </Button>

            <Button 
                isDisabled={currentPage === pageCount} 
                onClick={() => changePage(currentPage + 1)}
            >
                <BsChevronRight />
            </Button>

            <Button 
                isDisabled={currentPage === pageCount} 
                onClick={() => changePage(pageCount)}
            >
                <BsChevronDoubleRight />
            </Button>
        </Flex>
    );
}
